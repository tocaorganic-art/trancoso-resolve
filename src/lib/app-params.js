const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// KAN-14: em produção, um atacante não pode usar estes três parâmetros na URL para
// apontar o app para um backend arbitrário, se passar por um app_id diferente
// ou injetar uma sessão via URL (session fixation).
const LOCKED_FROM_URL_IN_PRODUCTION = new Set(['app_id', 'server_url', 'access_token']);

// app_id/server_url em produção vêm sempre da build oficial - nunca da URL nem
// do storage. access_token NÃO entra aqui: o SDK do Base44 persiste o token
// legítimo em storage após o login (setToken) e essa sessão precisa sobreviver
// a um refresh de página - só a origem "URL" é bloqueada para access_token.
const BUILD_ONLY_IN_PRODUCTION = new Set(['app_id', 'server_url']);

// Marcador de limpeza única: evita que o purge de contaminação legada rode a
// cada carregamento e derrube sessões legítimas já em storage.
const PURGE_MARKER_KEY = 'base44_kan14_purge_v1';

// Núcleo puro, sem window/import.meta, para poder ser testado com mocks.
export const computeAppParams = ({ isProd, storage, location, history, env = {} }) => {
	const getValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
		const storageKey = `base44_${toSnakeCase(paramName)}`;
		const urlParams = new URLSearchParams(location.search);
		const searchParam = urlParams.get(paramName);
		const lockedFromUrl = isProd && LOCKED_FROM_URL_IN_PRODUCTION.has(paramName);

		if ((removeFromUrl || lockedFromUrl) && urlParams.has(paramName)) {
			urlParams.delete(paramName);
			const newUrl = `${location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
				}${location.hash}`;
			history.replaceState({}, '', newUrl);
		}

		if (isProd && BUILD_ONLY_IN_PRODUCTION.has(paramName)) {
			// Ignora URL e storage: só a configuração oficial do build vale.
			return defaultValue ?? null;
		}

		// Em produção, um access_token vindo da URL nunca é aceito - mas um
		// access_token já em storage (só pode ter sido escrito pelo próprio SDK,
		// já que este módulo nunca grava um valor vindo da URL em produção) é
		// uma sessão legítima e deve continuar valendo após um refresh.
		const effectiveSearchParam = lockedFromUrl ? null : searchParam;

		if (effectiveSearchParam) {
			storage.setItem(storageKey, effectiveSearchParam);
			return effectiveSearchParam;
		}
		if (defaultValue) {
			storage.setItem(storageKey, defaultValue);
			return defaultValue;
		}
		const storedValue = storage.getItem(storageKey);
		if (storedValue) {
			return storedValue;
		}
		return null;
	};

	if (isProd && !storage.getItem(PURGE_MARKER_KEY)) {
		// Purga, uma única vez por navegador, qualquer override legado persistido
		// por uma versão anterior (vulnerável) deste módulo ou por um link
		// malicioso acessado antes desta correção. Depois desta primeira
		// passagem o marcador impede que isto rode de novo, para não forçar
		// logout de uma sessão legítima a cada carregamento.
		storage.removeItem('base44_app_id');
		storage.removeItem('base44_server_url');
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
		storage.setItem(PURGE_MARKER_KEY, '1');
	}

	if (getValue('clear_access_token') === 'true') {
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
	}

	return {
		appId: getValue('app_id', { defaultValue: env.VITE_BASE44_APP_ID, removeFromUrl: true }),
		serverUrl: getValue('server_url', { defaultValue: env.VITE_BASE44_BACKEND_URL, removeFromUrl: true }),
		token: getValue('access_token', { removeFromUrl: true }),
		fromUrl: getValue('from_url', { defaultValue: location.href }),
		functionsVersion: getValue('functions_version'),
	}
}

const isNode = typeof window === 'undefined';
const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

export const appParams = isNode
	? {
		appId: env.VITE_BASE44_APP_ID ?? null,
		serverUrl: env.VITE_BASE44_BACKEND_URL ?? null,
		token: null,
		fromUrl: null,
		functionsVersion: null,
	}
	: computeAppParams({
		isProd: !!env.PROD,
		storage: window.localStorage,
		location: window.location,
		history: window.history,
		env,
	});
