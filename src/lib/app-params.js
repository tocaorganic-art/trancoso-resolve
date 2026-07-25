const toSnakeCase = (str) => {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// KAN-14: em produção, um atacante não pode usar estes três parâmetros para
// apontar o app para um backend arbitrário, se passar por um app_id diferente
// ou injetar uma sessão via URL (session fixation).
const LOCKED_IN_PRODUCTION = new Set(['app_id', 'server_url', 'access_token']);

// Núcleo puro, sem window/import.meta, para poder ser testado com mocks.
export const computeAppParams = ({ isProd, storage, location, history, env = {} }) => {
	const getValue = (paramName, { defaultValue = undefined, removeFromUrl = false } = {}) => {
		const storageKey = `base44_${toSnakeCase(paramName)}`;
		const urlParams = new URLSearchParams(location.search);
		const searchParam = urlParams.get(paramName);

		if (removeFromUrl && urlParams.has(paramName)) {
			urlParams.delete(paramName);
			const newUrl = `${location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ""
				}${location.hash}`;
			history.replaceState({}, '', newUrl);
		}

		if (isProd && LOCKED_IN_PRODUCTION.has(paramName)) {
			// Ignora URL e localStorage: só a configuração oficial do build vale.
			return defaultValue ?? null;
		}

		if (searchParam) {
			storage.setItem(storageKey, searchParam);
			return searchParam;
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

	if (isProd) {
		// Purga, uma única vez, qualquer override legado persistido por uma
		// versão anterior (vulnerável) deste módulo ou por um link malicioso
		// acessado antes desta correção.
		storage.removeItem('base44_app_id');
		storage.removeItem('base44_server_url');
		storage.removeItem('base44_access_token');
		storage.removeItem('token');
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
