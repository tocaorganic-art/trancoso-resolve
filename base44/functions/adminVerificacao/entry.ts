import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { verificacao_id, action, motivo } = await req.json();

    if (!verificacao_id || !action) {
      return Response.json({ error: 'verificacao_id e action são obrigatórios' }, { status: 400 });
    }

    if (!['aprovar', 'rejeitar'].includes(action)) {
      return Response.json({ error: 'action deve ser "aprovar" ou "rejeitar"' }, { status: 400 });
    }

    const newStatus = action === 'aprovar' ? 'Verificado' : 'Rejeitado';
    const adminNotes = action === 'rejeitar' && motivo
      ? `❌ Rejeitado pelo admin: ${motivo}`
      : (action === 'aprovar' ? `✅ Aprovado pelo admin ${user.full_name || user.email}` : '');

    const updateData = { status: newStatus };
    if (adminNotes) updateData.admin_notes = adminNotes;

    await base44.asServiceRole.entities.Verificacao.update(verificacao_id, updateData);

    // Se aprovado, marca o ServiceProvider como verificado
    if (action === 'aprovar') {
      const verificacao = await base44.asServiceRole.entities.Verificacao.get(verificacao_id);
      if (verificacao?.user_email) {
        const providers = await base44.asServiceRole.entities.ServiceProvider.filter({});
        const provider = providers.find(p => p.created_by === verificacao.user_email);
        if (provider) {
          await base44.asServiceRole.entities.ServiceProvider.update(provider.id, { verified: true });
          console.log(`[adminVerificacao] Marked provider ${provider.id} as verified`);
        }
      }
    }

    console.log(`[adminVerificacao] ${action} verificacao ${verificacao_id} by ${user.email}`);
    return Response.json({ ok: true, status: newStatus });

  } catch (error) {
    console.error('[adminVerificacao] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});