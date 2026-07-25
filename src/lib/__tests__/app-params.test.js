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

// ── Produção: localStorage contaminado por versão antiga é purgado ──

test('produção: app_id/server_url falsos já salvos no localStorage são purgados', () => {
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

test('produção: token antigo salvo no localStorage é purgado (força novo login)', () => {
	const { result, storage } = run({
		isProd: true,
		storageSeed: { base44_access_token: 'token-antigo-injetado', token: 'token-antigo-injetado' },
	});
	assert.equal(result.token, null);
	assert.equal(storage._dump().base44_access_token, undefined);
	assert.equal(storage._dump().token, undefined);
});

test('produção: combinação dos três valores contaminados é purgada de uma vez', () => {
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
