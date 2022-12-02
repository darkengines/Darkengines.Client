import IIdentity from './IIdentity';

export interface IAuthenticationState {
	idToken: string;
	identity: IIdentity;
	error: any;
}
