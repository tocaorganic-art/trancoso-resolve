import assert from 'node:assert/strict';
import { test } from 'node:test';
import { computeAppParams } from '../app-params.js';

const OFFICIAL_APP_ID = 'official-app-id';
const OFFICIAL_SERVER_URL = 'https://official-backend.example.test';

const makeStorage = (initial = {}) => {
	const map = new Map(Object.entries(initial));
	return {
		getItem: (key) => (map.has(key) ? map.get(key) : null),
		setItem: (key, value) => map.set(key, value),
		removeItem: (key) => map.delete(key),
		_dump: () => Object.fromEntries(map),
	};
};

const makeLocation = (search = '') => ({
	pathname: '/algum-caminho',
	search,
	hash: '',
	href: `https://app.test/algum-caminho${search}`,
});

const makeHistory = () => {
	const calls = [];
	return { replaceState: (...args) => calls.push(args), _calls: calls };
};

const officialEnv = { VITE_BASE44_APP_ID: OFFICIAL_APP_ID, VITE_BASE44_BACKEND_URL: OFFICIAL_SERVER_URL };

const run = ({ isProd, search = '', storageSeed = {}, env = officialEnv }) => {
	const storage = makeStorage(storageSeed);
	const location = makeLocation(search);
	const history = makeHistory();
	const result = computeAppParams({ isProd, storage, location, history, env });
	return { result, storage, history };
};

// ── Produção: query string maliciosa nunca vence a configuração oficial ──

test('produção: backend falso na URL é ignorado', () => {
	const { result } = run({ isProd: true, search: '?server_url=https://backend-falso.example.test' });
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
});

test('produção: backend HTTP na URL é ignorado', () => {
	const { result } = run({ isProd: true, search: '?server_url=http://backend-falso.example.test' });
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
});

test('produção: domínio parecido com o oficial é ignorado', () => {
	const { result } = run({ isProd: true, search: '?server_url=https://official-backend.example.test.evil.com' });
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
});

test('produção: app_id falso na URL é ignorado', () => {
	const { result } = run({ isProd: true, search: '?app_id=fake-app-id' });
	assert.equal(result.appId, OFFICIAL_APP_ID);
});

test('produção: access_token na URL nunca é aceito', () => {
	const { result } = run({ isProd: true, search: '?access_token=test-token' });
	assert.equal(result.token, null);
});

test('produção: parâmetros combinados e repetidos são todos ignorados', () => {
	const { result } = run({
		isProd: true,
		search: '?app_id=fake-app-id&server_url=https://backend-falso.example.test&access_token=test-token&app_id=outro-fake',
	});
	assert.equal(result.appId, OFFICIAL_APP_ID);
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
	assert.equal(result.token, null);
});

test('produção: valores vazios ou malformados na URL não quebram e não substituem o oficial', () => {
	const { result } = run({ isProd: true, search: '?server_url=&app_id=&access_token=%00%00' });
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
	assert.equal(result.appId, OFFICIAL_APP_ID);
});

test('produção: nada malicioso é persistido no storage', () => {
	const { storage } = run({
		isProd: true,
		search: '?app_id=fake-app-id&server_url=https://backend-falso.example.test&access_token=test-token',
	});
	const dump = storage._dump();
	assert.equal(dump.base44_app_id, undefined);
	assert.equal(dump.base44_server_url, undefined);
	assert.equal(dump.base44_access_token, undefined);
});

// ── Produção: localStorage contaminado por versão antiga é purgado (1x) ──

test('produção: app_id/server_url falsos já salvos no localStorage são purgados na 1ª carga', () => {
	const { result, storage } = run({
		isProd: true,
		storageSeed: {
			base44_app_id: 'fake-app-id-antigo',
			base44_server_url: 'https://backend-falso.example.test',
		},
	});
	assert.equal(result.appId, OFFICIAL_APP_ID);
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
	// Em produção o app_id/server_url oficiais vêm sempre do build, nunca do
	// storage — por isso o valor contaminado é removido e nada é regravado.
	assert.equal(storage._dump().base44_app_id, undefined);
	assert.equal(storage._dump().base44_server_url, undefined);
});

test('produção: token antigo salvo no localStorage é purgado na 1ª carga (força novo login)', () => {
	const { result, storage } = run({
		isProd: true,
		storageSeed: { base44_access_token: 'token-antigo-injetado', token: 'token-antigo-injetado' },
	});
	assert.equal(result.token, null);
	assert.equal(storage._dump().base44_access_token, undefined);
	assert.equal(storage._dump().token, undefined);
	// Marcador de purge único gravado, para não repetir a purga nas próximas cargas.
	assert.equal(storage._dump().base44_kan14_purge_v1, '1');
});

test('produção: combinação dos três valores contaminados é purgada de uma vez na 1ª carga', () => {
	const { result } = run({
		isProd: true,
		storageSeed: {
			base44_app_id: 'fake',
			base44_server_url: 'https://evil.example.test',
			base44_access_token: 'fake-token',
		},
	});
	assert.equal(result.appId, OFFICIAL_APP_ID);
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
	assert.equal(result.token, null);
});

test('produção: dois refreshes consecutivos não entram em loop e convergem para o mesmo resultado', () => {
	const storage = makeStorage({ base44_app_id: 'fake-app-id' });
	const env = officialEnv;
	const first = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	const second = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.deepEqual(first, second);
	assert.equal(second.appId, OFFICIAL_APP_ID);
});

// ── Produção: sessão legítima do SDK sobrevive a refresh (bug corrigido) ──

test('produção: token legítimo gravado pelo SDK sobrevive a um refresh (marcador de purge já presente)', () => {
	// Simula: usuário já visitou o site uma vez (marcador de purge já setado),
	// depois fez login legítimo pelo SDK (que grava base44_access_token via setToken).
	const storage = makeStorage({
		base44_kan14_purge_v1: '1',
		base44_access_token: 'token-legitimo-do-sdk',
		token: 'token-legitimo-do-sdk',
	});
	const { result } = run({ isProd: true, storageSeed: storage._dump() });
	assert.equal(result.token, 'token-legitimo-do-sdk');
});

test('produção: dois refreshes seguidos após login legítimo mantêm a mesma sessão (sem logout forçado)', () => {
	const storage = makeStorage({ base44_kan14_purge_v1: '1' });
	const env = officialEnv;
	// 1ª carga: sem login ainda.
	computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	// Login legítimo: o SDK grava o token (fora do computeAppParams, como o setToken real faz).
	storage.setItem('base44_access_token', 'token-legitimo-do-sdk');
	storage.setItem('token', 'token-legitimo-do-sdk');
	// Refresh 1 após login.
	const afterLogin = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.equal(afterLogin.token, 'token-legitimo-do-sdk');
	// Navega para outra página e dá refresh de novo (refresh 2).
	const afterSecondRefresh = computeAppParams({
		isProd: true, storage, location: makeLocation(), history: makeHistory(), env,
	});
	assert.equal(afterSecondRefresh.token, 'token-legitimo-do-sdk');
});

test('produção: mesmo com sessão legítima em storage, access_token malicioso na URL nunca é aceito', () => {
	const storage = makeStorage({
		base44_kan14_purge_v1: '1',
		base44_access_token: 'token-legitimo-do-sdk',
	});
	const { result } = run({
		isProd: true,
		search: '?access_token=token-malicioso-na-url',
		storageSeed: storage._dump(),
	});
	// A URL nunca vence: ou fica o token legítimo do storage, ou nada — nunca o da URL.
	assert.notEqual(result.token, 'token-malicioso-na-url');
	assert.equal(result.token, 'token-legitimo-do-sdk');
});

test('produção: logout (auth.logout) remove o token e a próxima carga não reaparece com sessão', () => {
	const storage = makeStorage({ base44_kan14_purge_v1: '1', base44_access_token: 'token-legitimo', token: 'token-legitimo' });
	// auth.logout() do SDK remove as mesmas duas chaves.
	storage.removeItem('base44_access_token');
	storage.removeItem('token');
	const { result } = run({ isProd: true, storageSeed: storage._dump() });
	assert.equal(result.token, null);
});

test('produção: sem env oficial configurada, appId/serverUrl falham de forma segura (null), nunca usam a URL', () => {
	const { result } = run({
		isProd: true,
		search: '?app_id=fake-app-id&server_url=https://backend-falso.example.test',
		env: {},
	});
	assert.equal(result.appId, null);
	assert.equal(result.serverUrl, null);
});

// ── Desenvolvimento: comportamento flexível preservado ──

test('dev: sem parâmetros na URL, comportamento padrão preservado (usa env)', () => {
	const { result } = run({ isProd: false, search: '' });
	assert.equal(result.appId, OFFICIAL_APP_ID);
	assert.equal(result.serverUrl, OFFICIAL_SERVER_URL);
});

test('dev: server_url informado via URL continua sendo aceito (uso do desenvolvedor local)', () => {
	const { result } = run({ isProd: false, search: '?server_url=https://backend-dev.example.test' });
	assert.equal(result.serverUrl, 'https://backend-dev.example.test');
});

test('dev: access_token informado via URL continua sendo aceito e removido da URL visível', () => {
	const { result, history } = run({ isProd: false, search: '?access_token=test-token' });
	assert.equal(result.token, 'test-token');
	assert.ok(history._calls.length >= 1);
});

// ── Contrato: shape consumido por base44Client.js não muda ──

test('contrato: shape do retorno tem exatamente os 5 campos esperados por base44Client.js', () => {
	const { result } = run({ isProd: true, search: '' });
	assert.deepEqual(Object.keys(result).sort(), ['appId', 'fromUrl', 'functionsVersion', 'serverUrl', 'token'].sort());
});

test('clear_access_token=true continua limpando o token em qualquer ambiente', () => {
	const { result, storage } = run({
		isProd: false,
		search: '?clear_access_token=true',
		storageSeed: { base44_access_token: 'algum-token', token: 'algum-token' },
	});
	assert.equal(storage._dump().base44_access_token, undefined);
	assert.equal(result.token, null);
});

// ── clear_access_token: comando efêmero, nunca persistido ──

test('clear_access_token: link de logout remove token, remove o parâmetro da URL e não persiste base44_clear_access_token', () => {
	const { result, storage, history } = run({
		isProd: true,
		search: '?clear_access_token=true',
		storageSeed: { base44_kan14_purge_v1: '1', base44_access_token: 'token-legitimo', token: 'token-legitimo' },
	});
	assert.equal(result.token, null);
	assert.equal(storage._dump().base44_access_token, undefined);
	assert.equal(storage._dump().token, undefined);
	assert.equal(storage._dump().base44_clear_access_token, undefined);
	assert.ok(history._calls.length >= 1, 'clear_access_token deve ser removido da URL');
});

test('clear_access_token: novo login depois do comando sobrevive a dois refreshes seguidos', () => {
	const storage = makeStorage({ base44_kan14_purge_v1: '1', base44_access_token: 'token-antigo', token: 'token-antigo' });
	const env = officialEnv;
	// Abre o link de logout.
	const afterClear = computeAppParams({
		isProd: true, storage, location: makeLocation('?clear_access_token=true'), history: makeHistory(), env,
	});
	assert.equal(afterClear.token, null);
	// Novo login legítimo: o SDK grava o token via setToken.
	storage.setItem('base44_access_token', 'token-novo-do-sdk');
	storage.setItem('token', 'token-novo-do-sdk');
	// Refresh 1.
	const refresh1 = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.equal(refresh1.token, 'token-novo-do-sdk');
	// Refresh 2.
	const refresh2 = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.equal(refresh2.token, 'token-novo-do-sdk');
});

test('clear_access_token: valor legado base44_clear_access_token=true é removido e não afeta login posterior', () => {
	const storage = makeStorage({
		base44_kan14_purge_v1: '1',
		base44_clear_access_token: 'true',
		base44_access_token: 'token-que-sera-limpo-pelo-legado',
	});
	const env = officialEnv;
	// 1ª carga: encontra o marcador legado, limpa a sessão da época e remove o marcador.
	const firstLoad = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.equal(firstLoad.token, null);
	assert.equal(storage._dump().base44_clear_access_token, undefined);
	// Login legítimo depois disso.
	storage.setItem('base44_access_token', 'token-legitimo-posterior');
	storage.setItem('token', 'token-legitimo-posterior');
	// 2ª carga: sem o marcador legado, o novo login não é apagado.
	const secondLoad = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.equal(secondLoad.token, 'token-legitimo-posterior');
});

test('clear_access_token: link repetido faz logout naquela carga sem criar efeito persistente', () => {
	const storage = makeStorage({ base44_kan14_purge_v1: '1' });
	const env = officialEnv;
	// Login, depois logout via link, depois login de novo, depois abre o link de novo.
	storage.setItem('base44_access_token', 'sessao-1');
	const firstClear = computeAppParams({
		isProd: true, storage, location: makeLocation('?clear_access_token=true'), history: makeHistory(), env,
	});
	assert.equal(firstClear.token, null);
	storage.setItem('base44_access_token', 'sessao-2');
	// Uma carga normal no meio do caminho não deve ser afetada por nenhum resíduo do comando anterior.
	const normalLoad = computeAppParams({ isProd: true, storage, location: makeLocation(), history: makeHistory(), env });
	assert.equal(normalLoad.token, 'sessao-2');
	const secondClear = computeAppParams({
		isProd: true, storage, location: makeLocation('?clear_access_token=true'), history: makeHistory(), env,
	});
	assert.equal(secondClear.token, null);
});

test('clear_access_token combinado com access_token malicioso na URL: sessão existente removida, token da URL ignorado, nada persistido', () => {
	const { result, storage } = run({
		isProd: true,
		search: '?clear_access_token=true&access_token=token-malicioso',
		storageSeed: { base44_kan14_purge_v1: '1', base44_access_token: 'token-legitimo', token: 'token-legitimo' },
	});
	assert.equal(result.token, null);
	assert.notEqual(result.token, 'token-malicioso');
	assert.equal(storage._dump().base44_access_token, undefined);
	assert.equal(storage._dump().token, undefined);
});

test('clear_access_token: em desenvolvimento também nunca persiste base44_clear_access_token', () => {
	const { storage } = run({ isProd: false, search: '?clear_access_token=true' });
	assert.equal(storage._dump().base44_clear_access_token, undefined);
});
