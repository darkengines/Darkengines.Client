import { Stateful } from '../States/Stateful';
import { b64utoutf8, KJUR } from 'jsrsasign';
import IIdentity from './IIdentity';
import publicKeyString from '!raw-loader!../../../public.pem';
import { IAuthenticationState } from './IAuthenticationState';
import { queryProvider, rawQuery } from '../Api/QueryProvider';

export class Authentication {
	public static extractPayload(jwt: string): IIdentity {
		const b64Payload = jwt.split('.')[1];
		const payload = JSON.parse(b64utoutf8(b64Payload));
		return payload.user;
	}

	public static storedStateToState(state: IAuthenticationState): IAuthenticationState {
		if (state && state.idToken) {
			const isValid = KJUR.jws.JWS.verifyJWT(state.idToken, publicKeyString, {
				alg: ['RS256'],
			} as any);
			if (!isValid) {
				state.idToken = null;
				state.identity = null;
			}
		}
		return state;
	}

	public static saveState(state: IAuthenticationState) {
		localStorage.setItem(Authentication.name, JSON.stringify(state));
	}
}

let authenticationState: IAuthenticationState = undefined;
if (typeof window != 'undefined') {
	authenticationState = JSON.parse(
		localStorage.getItem(Authentication.name)
	) as IAuthenticationState;
}
const initialState = {
	idToken: undefined,
	identity: undefined,
	error: undefined,
};

authenticationState = Authentication.storedStateToState(authenticationState) ?? initialState;

const authentication = Stateful.create(authenticationState, {
	disconnect: async (state) => {
		localStorage?.removeItem(Authentication.name);
		return initialState;
	},
	create: async (state, login: string, emailAddress: string, password: string) => {
		try {
			const idToken = await queryProvider
				.query<string>(
					rawQuery`Authentication.Create(${login}, ${emailAddress}, ${password})`
				)
				.execute();
			const identity = Authentication.extractPayload(idToken);
			authenticationState = { ...authenticationState, idToken, identity, error: undefined };
			if (localStorage) {
				Authentication.saveState(authenticationState);
			}
		} catch (error) {
			authenticationState = {
				...authenticationState,
				identity: undefined,
				idToken: undefined,
				error,
			};
		}
		return authenticationState;
	},
	authenticate: async (state, emailAddress: string, password: string) => {
		try {
			const idToken = await queryProvider
				.query<string>(rawQuery`Authentication.Login(${emailAddress}, ${password})`)
				.execute();
			const identity = Authentication.extractPayload(idToken);
			authenticationState = { ...authenticationState, idToken, identity, error: undefined };
			if (localStorage) {
				Authentication.saveState(authenticationState);
			}
		} catch (error) {
			authenticationState = {
				...authenticationState,
				identity: undefined,
				idToken: undefined,
				error,
			};
		}
		return authenticationState;
	},
});

export { authentication };
