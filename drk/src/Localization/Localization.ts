import { } from 'date-fns';
import { configureLocalization } from '@lit/localize';
import litLocalize from '../../lit-localize.json';
import { ILocalized } from './Models/ILocalized';
import { ILocalization } from './Models/ILocalization';

export const sourceLocale = litLocalize.sourceLocale;
export const targetLocales = litLocalize.targetLocales;
export const { getLocale, setLocale } = configureLocalization({
	sourceLocale,
	targetLocales,
	loadLocale: (locale) => {
		if (!targetLocales.includes(locale)) locale = sourceLocale;
		return import(`../../../locales/${locale}`);
	},
});
export function checkLocale(locale: string): string {
	if (!locale) return getLocale();
	if (![sourceLocale, ...targetLocales].includes(locale)) return getLocale();
	return locale;
}
export function localized<TLocalization extends ILocalization>(
	localized: ILocalized<TLocalization>,
	selector: (localized: TLocalization) => any,
	language?: string
) {
	language = checkLocale(language);
	let localization = localized.localizations.find(
		(localization) => localization.twoLetterISOLanguageName == language
	);
	if (!localization)
		localization = localized.localizations.find(
			(localization) => localization.twoLetterISOLanguageName == sourceLocale
		);
	if (!localization) localization = localized.localizations[0];
	return localization ? selector(localization) : undefined;
}
