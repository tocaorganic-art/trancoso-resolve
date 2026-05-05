import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { service_provider_id } = await req.json();

    if (!service_provider_id) {
      return Response.json({ error: 'service_provider_id é obrigatório' }, { status: 400 });
    }

    // Busca o prestador
    const providers = await base44.asServiceRole.entities.ServiceProvider.filter({});
    const prestador = providers.find(p => p.id === service_provider_id);

    if (!prestador) {
      return Response.json({ error: 'Prestador não encontrado' }, { status: 404 });
    }

    // Se não tiver CPF, marca para análise manual
    if (!prestador.cpf) {
      await base44.asServiceRole.entities.ServiceProvider.update(service_provider_id, {
        status_verificacao: 'em_analise_manual',
        relatorio_verificacao: 'CPF não informado. Verificação automática não pôde ser realizada. Necessária análise manual.',
        data_verificacao: new Date().toISOString(),
      });
      console.log(`[verificarAntecedentes] CPF ausente para ${prestador.full_name} (${service_provider_id})`);
      return Response.json({ status: 'em_analise_manual', message: 'CPF não informado. Análise manual necessária.' });
    }

    const INFOSIMPLES_API_KEY = Deno.env.get('INFOSIMPLES_API_KEY');

    if (!INFOSIMPLES_API_KEY) {
      console.error('[verificarAntecedentes] INFOSIMPLES_API_KEY não configurada!');
      return Response.json({ error: 'Chave da API Infosimples não configurada.' }, { status: 500 });
    }

    const headers = {
      'Authorization': `Token token=${INFOSIMPLES_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const cpfLimpo = prestador.cpf.replace(/\D/g, '');
    const nomePrestador = prestador.full_name;
    const uf = prestador.location?.state || '';
    const cnpj = prestador.cnpj ? prestador.cnpj.replace(/\D/g, '') : null;

    const resultados = [];

    // 1. Sempre: Polícia Federal (CPF)
    try {
      const pfRes = await fetch(
        'https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/policia-federal/emitir',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ cpf: cpfLimpo, nome: nomePrestador }),
        }
      );
      const pfData = await pfRes.json();
      console.log('[verificarAntecedentes] PF response code:', pfData?.code, 'status:', pfData?.data_status);
      resultados.push({ fonte: 'Polícia Federal', data: pfData });
    } catch (err) {
      console.error('[verificarAntecedentes] Erro na consulta PF:', err.message);
      resultados.push({ fonte: 'Polícia Federal', erro: true, mensagem: err.message });
    }

    // 2. Se UF for SP
    if (uf === 'SP') {
      try {
        const spRes = await fetch(
          'https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/sp',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ cpf: cpfLimpo, nome: nomePrestador }),
          }
        );
        const spData = await spRes.json();
        console.log('[verificarAntecedentes] SP response code:', spData?.code);
        resultados.push({ fonte: 'SP', data: spData });
      } catch (err) {
        console.error('[verificarAntecedentes] Erro na consulta SP:', err.message);
        resultados.push({ fonte: 'SP', erro: true, mensagem: err.message });
      }
    }

    // 3. Se UF for MG
    if (uf === 'MG') {
      try {
        const mgRes = await fetch(
          'https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/mg',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ cpf: cpfLimpo, nome: nomePrestador }),
          }
        );
        const mgData = await mgRes.json();
        console.log('[verificarAntecedentes] MG response code:', mgData?.code);
        resultados.push({ fonte: 'MG', data: mgData });
      } catch (err) {
        console.error('[verificarAntecedentes] Erro na consulta MG:', err.message);
        resultados.push({ fonte: 'MG', erro: true, mensagem: err.message });
      }
    }

    // 4. Se tiver CNPJ (MEI ou PJ): checar situação na Receita Federal
    if (cnpj) {
      try {
        const receitaRes = await fetch(
          'https://api.infosimples.com/api/v2/consultas/receita-federal/cnpj',
          {
            method: 'POST',
            headers,
            body: JSON.stringify({ cnpj }),
          }
        );
        const receitaData = await receitaRes.json();
        console.log('[verificarAntecedentes] Receita Federal CNPJ response code:', receitaData?.code);
        resultados.push({ fonte: 'Receita Federal CNPJ', data: receitaData });
      } catch (err) {
        console.error('[verificarAntecedentes] Erro na consulta Receita Federal:', err.message);
        resultados.push({ fonte: 'Receita Federal CNPJ', erro: true, mensagem: err.message });
      }
    }

    // 5. Classificar resultado
    const temErro = resultados.some(r => r.erro === true);

    const temAntecedente = resultados.some(r => {
      if (!r.data) return false;
      if (r.data.code !== 200) return false;
      const item = r.data.data?.[0];
      if (!item) return false;
      // Checa campos comuns de antecedentes
      if (item.nada_consta === false) return true;
      if (item.possui_antecedentes === true) return true;
      if (item.resultado === 'positivo') return true;
      if (item.condenacao === true) return true;
      const texto = JSON.stringify(item).toLowerCase();
      if (texto.includes('condenação') || texto.includes('condenado')) return true;
      return false;
    });

    const cnpjIrregular = resultados.some(r =>
      r.fonte === 'Receita Federal CNPJ' &&
      r.data?.code === 200 &&
      r.data?.data?.[0]?.situacao_cadastral &&
      r.data.data[0].situacao_cadastral !== 'ATIVA'
    );

    let status_verificacao;
    let relatorio_verificacao;

    if (temAntecedente) {
      status_verificacao = 'reprovado';
      relatorio_verificacao = 'Foram encontrados registros de antecedentes criminais em bases oficiais. Perfil bloqueado para proteção da comunidade.';
    } else if (temErro || cnpjIrregular) {
      status_verificacao = 'em_analise_manual';
      const motivo = cnpjIrregular
        ? 'CNPJ com situação irregular na Receita Federal.'
        : 'Erro em uma ou mais bases consultadas.';
      relatorio_verificacao = `Resultado com inconsistências. ${motivo} Necessária análise manual pela equipe.`;
    } else {
      status_verificacao = 'aprovado';
      const basesConsultadas = ['Polícia Federal', uf && (uf === 'SP' || uf === 'MG') ? uf : null, cnpj ? 'Receita Federal (CNPJ)' : null]
        .filter(Boolean).join(', ');
      relatorio_verificacao = `Nenhum antecedente criminal encontrado. Bases consultadas: ${basesConsultadas}.`;
    }

    // 6. Atualiza o prestador
    const updateData = {
      status_verificacao,
      relatorio_verificacao,
      data_verificacao: new Date().toISOString(),
    };

    // Atualiza também status_verificacao_empresa se havia CNPJ
    if (cnpj) {
      updateData.status_verificacao_empresa = cnpjIrregular ? 'em_risco' : 'regular';
      const receitaResult = resultados.find(r => r.fonte === 'Receita Federal CNPJ');
      if (receitaResult?.data?.data?.[0]) {
        const d = receitaResult.data.data[0];
        updateData.relatorio_verificacao_empresa = `Situação: ${d.situacao_cadastral || '—'}. Tipo: ${d.natureza_juridica || '—'}.`;
      }
    }

    await base44.asServiceRole.entities.ServiceProvider.update(service_provider_id, updateData);

    console.log(`[verificarAntecedentes] Concluído para ${prestador.full_name}: ${status_verificacao}`);

    return Response.json({
      status: status_verificacao,
      relatorio: relatorio_verificacao,
      provider_id: service_provider_id,
    });

  } catch (error) {
    console.error('[verificarAntecedentes] Erro geral:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});