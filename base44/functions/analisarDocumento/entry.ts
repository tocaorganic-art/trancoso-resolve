import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { verificacao_id, document_url, document_type, user_full_name } = await req.json();

    if (!verificacao_id || !document_url) {
      return Response.json({ error: 'verificacao_id e document_url são obrigatórios' }, { status: 400 });
    }

    // Pré-análise por IA
    const aiResult = await base44.integrations.Core.InvokeLLM({
      prompt: `Você é um especialista em verificação de documentos brasileiros. Analise a imagem do documento (${document_type}) e extraia as seguintes informações:
1. Nome completo da pessoa
2. Data de nascimento (formato DD/MM/AAAA)
3. Se o documento parece autêntico e legível

Responda APENAS no formato JSON exigido, sem texto adicional.

Nome do usuário cadastrado na plataforma: "${user_full_name}"

Compare o nome extraído com o nome cadastrado e informe se há divergência.`,
      file_urls: [document_url],
      response_json_schema: {
        type: "object",
        properties: {
          extracted_name: { type: "string" },
          extracted_dob: { type: "string" },
          name_matches: { type: "boolean" },
          document_readable: { type: "boolean" },
          confidence: { type: "number" },
          divergence_notes: { type: "string" }
        }
      }
    });

    console.log('[analisarDocumento] AI result:', JSON.stringify(aiResult));

    const nameMatches = aiResult.name_matches && aiResult.document_readable;
    const newStatus = nameMatches ? "Em Análise" : "Pendente";

    let adminNotes = "";
    if (!aiResult.document_readable) {
      adminNotes = "⚠️ IA: Documento ilegível ou de baixa qualidade. Requer revisão manual.";
    } else if (!aiResult.name_matches) {
      adminNotes = `⚠️ IA: Divergência detectada. Nome no documento: "${aiResult.extracted_name}" | Nome cadastrado: "${user_full_name}". ${aiResult.divergence_notes || ''}`;
    } else {
      adminNotes = `✅ IA: Nome confirmado (${aiResult.extracted_name}). Aguardando aprovação manual do admin.`;
    }

    // Atualiza a verificação com os dados da IA usando service role
    await base44.asServiceRole.entities.Verificacao.update(verificacao_id, {
      status: newStatus,
      ai_extracted_name: aiResult.extracted_name || "",
      ai_extracted_dob: aiResult.extracted_dob || "",
      ai_confidence: aiResult.confidence || 0,
      admin_notes: adminNotes
    });

    return Response.json({
      ok: true,
      status: newStatus,
      ai_result: aiResult,
      admin_notes: adminNotes
    });

  } catch (error) {
    console.error('[analisarDocumento] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});