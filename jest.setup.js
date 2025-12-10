// Newer versions of @testing-library/jest-dom export matchers from the package root
import '@testing-library/jest-dom';

// silence next/navigation warnings in tests
global.__NEXT_DATA__ = global.__NEXT_DATA__ || {};

// Minimal web platform polyfills used by Next route handlers in tests
class _Response {
	constructor(body = null, init = {}) {
		this._body = body;
		this.status = init.status || 200;
	}
	async text() {
		if (typeof this._body === 'string') return this._body;
		return JSON.stringify(this._body);
	}
	async json() {
		return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
	}
}

class _Request {
	constructor(input, init = {}) {
		if (typeof input === 'string') {
			this.url = input;
		} else if (input && input.url) {
			this.url = input.url;
		}
		this.method = init.method || (input && input.method) || 'GET';
		this.headers = init.headers || {};
	}
}

global.Response = global.Response || _Response;
global.Request = global.Request || _Request;

// Provide a lightweight NextResponse mock so route handlers can call NextResponse.json()
jest.mock('next/server', () => ({
	NextResponse: {
		json: (payload, init = {}) => ({
			json: async () => payload,
			status: init.status || 200,
			_payload: payload,
		}),
	},
}));
