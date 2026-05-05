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

    if (!prestador.cpf || !prestador.full_name) {
      // Sem CPF, marca como em_analise_manual
      await base44.asServiceRole.entities.ServiceProvider.update(service_provider_id, {
        status_verificacao: 'em_analise_manual',
        relatorio_verificacao: 'CPF não cadastrado. Necessária análise manual para prosseguir com a verificação.',
        data_verificacao: new Date().toISOString(),
      });
      return Response.json({ status: 'em_analise_manual', message: 'CPF não encontrado, análise manual necessária' });
    }

    const INFOSIMPLES_API_KEY = Deno.env.get('INFOSIMPLES_API_KEY');

    const headers = {
      'Authorization': `Token token=${INFOSIMPLES_API_KEY}`,
      'Content-Type': 'application/json',
    };

    const body = {
      cpf: prestador.cpf.replace(/\D/g, ''),
      nome: prestador.full_name,
    };

    // Consulta Polícia Federal (sempre)
    let pfData = null;
    let pfError = false;
    try {
      const pfResponse = await fetch(
        'https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/policia-federal/emitir',
        { method: 'POST', headers, body: JSON.stringify(body) }
      );
      pfData = await pfResponse.json();
      console.log('PF response:', JSON.stringify({ code: pfData?.code, status: pfData?.data_status }));
    } catch (e) {
      console.error('Erro na consulta PF:', e.message);
      pfError = true;
    }

    // Consulta estadual (SP ou MG)
    const uf = prestador.location?.state || prestador.uf || '';
    let estadualData = null;
    let estadualError = false;

    if (uf === 'SP') {
      try {
        const spResponse = await fetch(
          'https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/sp',
          { method: 'POST', headers, body: JSON.stringify(body) }
        );
        estadualData = await spResponse.json();
        console.log('SP response:', JSON.stringify({ code: estadualData?.code, status: estadualData?.data_status }));
      } catch (e) {
        console.error('Erro na consulta SP:', e.message);
        estadualError = true;
      }
    } else if (uf === 'MG') {
      try {
        const mgResponse = await fetch(
          'https://api.infosimples.com/api/v2/consultas/antecedentes-criminais/mg',
          { method: 'POST', headers, body: JSON.stringify(body) }
        );
        estadualData = await mgResponse.json();
        console.log('MG response:', JSON.stringify({ code: estadualData?.code, status: estadualData?.data_status }));
      } catch (e) {
        console.error('Erro na consulta MG:', e.message);
        estadualError = true;
      }
    }

    // Classificação do resultado
    let status_verificacao = 'aprovado';
    let relatorio_verificacao = '';

    const temAntecedentes = (data) => {
      if (!data) return false;
      if (data.code !== 200) return false;
      const item = data.data?.[0];
      if (!item) return false;
      const texto = JSON.stringify(item).toLowerCase();
      return texto.includes('condenação') || 
             texto.includes('condenado') || 
             texto.includes('antecedentes') && !texto.includes('nada consta') && !texto.includes('sem registro') ||
             item.resultado === 'positivo' ||
             item.condenacao === true;
    };

    const resultadoInconclusivo = (data, hasError) => {
      if (hasError) return true;
      if (!data) return false;
      if (data.code !== 200) return true;
      return false;
    };

    const pfTemAntecedentes = temAntecedentes(pfData);
    const estadualTemAntecedentes = temAntecedentes(estadualData);
    const pfInconclusivo = resultadoInconclusivo(pfData, pfError);
    const estadualInconclusivo = resultadoInconclusivo(estadualData, estadualError);

    if (pfTemAntecedentes || estadualTemAntecedentes) {
      status_verificacao = 'reprovado';
      relatorio_verificacao = 'Foram encontrados registros de antecedentes criminais em bases oficiais. Perfil bloqueado para proteção da comunidade.';
    } else if (pfInconclusivo || estadualInconclusivo) {
      status_verificacao = 'em_analise_manual';
      relatorio_verificacao = 'Resultado de antecedentes com inconsistências ou erro em uma das bases. Necessária análise manual.';
    } else {
      status_verificacao = 'aprovado';
      const basesConsultadas = uf ? `Polícia Federal e bases estaduais (${uf})` : 'Polícia Federal';
      relatorio_verificacao = `Nenhum antecedente criminal encontrado na ${basesConsultadas} consultadas.`;
    }

    // Atualiza o prestador
    await base44.asServiceRole.entities.ServiceProvider.update(service_provider_id, {
      status_verificacao,
      relatorio_verificacao,
      data_verificacao: new Date().toISOString(),
    });

    console.log(`Verificação concluída para ${prestador.full_name}: ${status_verificacao}`);

    return Response.json({ 
      status: status_verificacao, 
      relatorio: relatorio_verificacao,
      provider_id: service_provider_id 
    });

  } catch (error) {
    console.error('Erro em verificarAntecedentes:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});