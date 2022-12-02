import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { ILocalization } from '../../Localization/Models/ILocalization';
import { ICollectionModel } from '../../Model/ICollectionModel';
import { IModel } from '../../Model/IModel';
import { IComponentFactory, IComponentProps } from '../IComponentFactory';

export interface ILocalizedDisplayProps extends IComponentProps<ICollectionModel, ILocalization[]> {
	underlyingComponentFactory: IComponentFactory;
	property: IModel;
	languages: string[];
	defaultLanguage: string;
}

@customElement('drk-localized-display')
class LocalizedDisplay extends LitElement {
	@property({ type: Object })
	public props: ILocalizedDisplayProps;
	public static get styles() {
		return css`
			:host {
				display: inline-block;
				display: grid;
				grid-auto-flow: row;
				grid-gap: calc(var(--content-spacing) / 2);
			}
			.flag {
				width: 24px;
				border: solid 1px rgba(0, 0, 0, 0.32);
			}
			.localization {
				display: grid;
				grid-template-columns: auto 1fr;
				align-items: center;
				grid-gap: calc(var(--content-spacing) / 2);
				justify-content: start;
			}
		`;
	}
	render() {
		return this.props.value?.length
			? repeat(this.props.value, (value) => {
					return html`<div class="localization">
						<img
							class="flag"
							src="/assets/localization/languages/icons/${value.twoLetterISOLanguageName}.png"
						/>
						<div class="component">
							${this.props.underlyingComponentFactory.display(
								{
									value: value[this.props.property.name],
									model: this.props.property,
									component: undefined,
								},
								undefined
							)}
						</div>
					</div>`;
			  })
			: html`<div>No traductions</div>`;
	}
}
