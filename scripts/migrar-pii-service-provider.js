#!/usr/bin/env node
/**
 * KAN-13 — Migração PII: ServiceProvider → ServiceProviderPrivate
 *
 * OBJETIVO: Mover campos sensíveis (CPF, CNPJ, fotos de verificação,
 * autorizou_verificacao) do ServiceProvider para a entidade privada
 * ServiceProviderPrivate, que possui RLS restritivo.
 *
 * IDEMPOTENTE: pode ser executado várias vezes sem duplicar registros.
 * Um registro ServiceProviderPrivate por provider_id é garantido pelo
 * filtro antes de criar.
 *
 * DRY RUN: passe --dry-run para simular sem alterar dados.
 *
 * ROLLBACK: os dados NÃO são apagados do ServiceProvider neste script.
 * Para reverter, basta parar de usar ServiceProviderPrivate e reler
 * os campos do ServiceProvider até que a migração seja validada.
 *
 * USO:
 *   node scripts/migrar-pii-service-provider.js [--dry-run]
 *
 * VARIÁVEIS DE AMBIENTE NECESSÁRIAS:
 *   BASE44_APP_ID      — ID do app Base44
 *   BASE44_API_KEY     — Service role API key (não a chave pública)
 *   BASE44_SERVER_URL  — URL do backend Base44 (ex: https://api.base44.app)
 */

import { createClient } from '@base44/sdk';

const DRY_RUN = process.argv.includes('--dry-run');

const PII_FIELDS = ['cpf', 'cnpj', 'verification_document_url', 'full_body_photo_url', 'autorizou_verificacao'];

async function migrar() {
  const appId = process.env.BASE44_APP_ID;
  const apiKey = process.env.BASE44_API_KEY;
  const serverUrl = process.env.BASE44_SERVER_URL;

  if (!appId || !apiKey || !serverUrl) {
    console.error('ERRO: BASE44_APP_ID, BASE44_API_KEY e BASE44_SERVER_URL são obrigatórios.');
    process.exit(1);
  }

  const base44 = createClient({ appId, serverUrl, accessToken: apiKey });

  console.log(`\n=== MIGRAÇÃO PII ServiceProvider → ServiceProviderPrivate ===`);
  console.log(`Modo: ${DRY_RUN ? 'DRY RUN (nenhum dado será alterado)' : 'PRODUÇÃO'}`);

  // 1. Carregar todos os prestadores
  const providers = await base44.entities.ServiceProvider.list('-created_date', 1000);
  console.log(`\nPrestadores encontrados: ${providers.length}`);

  let criados = 0;
  let jaExistentes = 0;
  let semPii = 0;
  let erros = 0;

  for (const p of providers) {
    const hasPii = PII_FIELDS.some(f => p[f] != null && p[f] !== '');
    if (!hasPii) {
      semPii++;
      continue;
    }

    // Verificar se já existe registro privado
    const existing = await base44.entities.ServiceProviderPrivate.filter({ provider_id: p.id });
    if (existing.length > 0) {
      jaExistentes++;
      console.log(`  [SKIP] provider ${p.id} (${p.full_name}) — registro privado já existe`);
      continue;
    }

    const piiData = {
      provider_id: p.id,
      ...(p.cpf ? { cpf: p.cpf } : {}),
      ...(p.cnpj ? { cnpj: p.cnpj } : {}),
      ...(p.verification_document_url ? { verification_document_url: p.verification_document_url } : {}),
      ...(p.full_body_photo_url ? { full_body_photo_url: p.full_body_photo_url } : {}),
      ...(p.autorizou_verificacao != null ? { autorizou_verificacao: p.autorizou_verificacao } : {}),
      data_consentimento: p.autorizou_verificacao ? (p.created_date || new Date().toISOString()) : undefined,
    };

    console.log(`  [CRIAR] provider ${p.id} (${p.full_name}) — campos: ${Object.keys(piiData).filter(k => k !== 'provider_id').join(', ')}`);

    if (!DRY_RUN) {
      try {
        await base44.entities.ServiceProviderPrivate.create(piiData);
        criados++;
      } catch (e) {
        console.error(`    ERRO ao criar ServiceProviderPrivate para ${p.id}: ${e.message}`);
        erros++;
      }
    } else {
      criados++;
    }
  }

  console.log(`\n=== RESULTADO ===`);
  console.log(`Total de prestadores: ${providers.length}`);
  console.log(`Sem PII (ignorados): ${semPii}`);
  console.log(`Já migrados (ignorados): ${jaExistentes}`);
  console.log(`Criados (${DRY_RUN ? 'simulado' : 'real'}): ${criados}`);
  console.log(`Erros: ${erros}`);

  if (DRY_RUN) {
    console.log('\n[DRY RUN] Nenhum dado foi alterado. Execute sem --dry-run para aplicar.');
  } else {
    console.log('\nMigração concluída. Os campos PII AINDA EXISTEM no ServiceProvider.');
    console.log('Valide os dados antes de removê-los do ServiceProvider.jsonc.');
  }
}

migrar().catch((e) => {
  console.error('Erro fatal:', e.message);
  process.exit(1);
});
