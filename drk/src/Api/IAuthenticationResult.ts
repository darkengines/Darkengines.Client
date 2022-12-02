import IIdentity from './IIdentity';


export interface IAuthenticationResult {
    identity: IIdentity;
    idToken: string;
}
