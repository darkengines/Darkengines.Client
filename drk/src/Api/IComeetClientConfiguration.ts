import IApiConfiguration from './IApiConfiguration';
import { ICredentials } from './ICredentials';


export interface IDarkenginesClientConfiguration {
    credentials?: ICredentials;
    apiConfiguration: IApiConfiguration;
}
