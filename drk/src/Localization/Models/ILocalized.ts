import { ILocalization } from './ILocalization';

export interface ILocalized<TLocalization extends ILocalization> {
	localizations: TLocalization[];
}
