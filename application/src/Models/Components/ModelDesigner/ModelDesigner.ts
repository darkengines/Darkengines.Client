import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';




import commonCss from '!raw-loader!../../../Common/Common.css';
import { IEntity } from '@drk/src/Models/Models/IEntity';
import { IPropertyModel } from '@drk/src/Model/IPropertyModel';
import { Dictionary } from 'ts-essentials';
import DefaultModelCustomizer from '@drk/src/Model/DefaultModelCustomizer';
import { IFormField } from '@drk/src/Components/Forms';
import '@drk/src/Components/DarkenginesForm/DarkenginesForm';
import { IModel } from '@drk/src/Models/Models/IModel';

declare global {
	interface HTMLElementTagNameMap {
		'drk-model-designer': ModelDesigner;
	}
}

export interface IModelDesignerProps {
	error?: string;
	model: IModel;
}

@customElement('drk-model-designer')
export class ModelDesigner extends LitElement {
	@property({ type: Object })
	public props: IModelDesignerProps;
	public save: (userProfileProps: IModelDesignerProps) => Promise<IModelDesignerProps>;
	public static get styles() {
		return [unsafeCSS(commonCss)];
	}

	render() {
		return html`Designer for ${this.props.model.name}`;
	}
}
