import { LitElement, html, css, PropertyValues, unsafeCSS, nothing } from 'lit';
import { getLanguage } from 'country-language';
import { customElement, property } from 'lit/decorators.js';
import {
	IComponentFactory,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../IComponentFactory';
import mdcTypographyCss from '!raw-loader!@material/typography/dist/mdc.typography.css';
import { ICollectionModel } from '../../Model/ICollectionModel';
import { SelectedDetail } from '@material/mwc-list';
import { repeat } from 'lit/directives/repeat.js';
import { IModel } from '../../Model/IModel';
import '../../../Common/Components/Select/Select';
import { ILocalization } from '../../Localization/Models/ILocalization';

export interface ILocalizedEditorProps
	extends IEditorComponentProps<ICollectionModel, ILocalization[]> {
	underlyingComponentFactory: IComponentFactory;
	property: IModel;
	languages: string[];
	defaultLanguage: string;
	selectedLanguage: string;
}

@customElement('drk-localized-editor')
class LocalizedEditor extends LitElement {
	@property({ type: Object })
	public props: ILocalizedEditorProps;
	public actions: IEditorComponentActions<ICollectionModel, ILocalization[]>;
	@property({ type: String })
	public selectedLanguage: string;
	public static get styles() {
		return css`
			${unsafeCSS(mdcTypographyCss)}
			:host {
				display: inline-block;
				display: grid;
				grid-auto-flow: row;
				grid-gap: calc(var(--content-spacing) / 2);
			}
			#component {
				grid-column: span 2;
			}
			#field {
				display: flex;
				flex-flow: row wrap;
				align-items: start;
				grid-gap: calc(var(--content-spacing) / 2);
				justify-content: start;
			}
			.flag {
				width: 24px;
				border: solid 1px rgba(0, 0, 0, 0.32);
			}
			.item {
				display: grid;
				grid-template-columns: auto 1fr;
				align-items: center;
				grid-gap: var(--content-spacing);
				justify-content: start;
			}
			#label {
				text-transform: capitalize;
				display: block;
			}
		`;
	}
	update(_changedProperties: PropertyValues) {
		if (_changedProperties.has('props')) {
			if (!this.selectedLanguage) this.selectedLanguage = this.props.defaultLanguage;
		}
		super.update(_changedProperties);
	}
	protected async onValueChanged(props: IEditorComponentProps) {
		let oldLocalization = this.props.value?.find(
			(localization) => localization.twoLetterISOLanguageName === this.selectedLanguage
		);
		const localization = {
			...oldLocalization,
			[this.props.property.name]: props.value,
			twoLetterISOLanguageName: this.selectedLanguage,
		};
		if (!oldLocalization) localization['$isCreation'] = true;
		const newValue = [
			...(this.props.value?.filter((localization) => localization !== oldLocalization) ?? []),
			localization,
		];
		await this.actions.valueChanged({ ...this.props, value: newValue });
	}
	render() {
		if (!this.props) return nothing;
		return html`
			<label id="label" class="mdc-typography--body1">${this.props.property.name}</label>
			<div id="field">
				<drk-select
					outlined
					@selected=${(e: CustomEvent<SelectedDetail>) => {
						const selectedLanguage = this.props.languages[e.detail.index as number];
						this.selectedLanguage = selectedLanguage;
					}}
				>
					${this.renderListItem(this.selectedLanguage, true)}
					${repeat(
						this.props.languages,
						(language) => language,
						(language) => this.renderListItem(language, false)
					)}
				</drk-select>
				<div id="component">
					${this.props.underlyingComponentFactory.edit(
						{
							value: this.props.value?.find(
								(localization) =>
									localization.twoLetterISOLanguageName ==
									this.selectedLanguage
							)?.[this.props.property.name],
							model: this.props.property,
							component: undefined,
						},
						{
							valueChanged: this.onValueChanged.bind(this),
						}
					)}
				</div>
			</div>
		`;
	}

	renderListItem(language: string, asValue: boolean = false) {
		return asValue
			? html`<mwc-list-item slot="value" text="${language}">
					<div class="item">
						<img
							class="flag"
							src="/assets/localization/languages/icons/${language}.png"
						/>
						${language
							? (getLanguage(language).nativeName[0] as string).capitilize()
							: nothing}
					</div>
			  </mwc-list-item>`
			: html`<mwc-list-item
					value="${language}"
					text="${language}"
					?selected=${language == this.props.selectedLanguage}
					?activated=${language == this.props.selectedLanguage}
			  >
					<div class="item">
						<img
							class="flag"
							src="/assets/localization/languages/icons/${language}.png"
						/>
						${language
							? (getLanguage(language).nativeName[0] as string).capitilize()
							: nothing}
					</div>
			  </mwc-list-item>`;
	}
}
