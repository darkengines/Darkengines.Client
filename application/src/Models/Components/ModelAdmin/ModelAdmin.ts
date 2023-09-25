import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import '@material/web/textfield/outlined-text-field';
import '@material/web/select/outlined-select';
import '@material/web/select/select-option';
import '@material/web/button/outlined-button';
import commonCss from '!raw-loader!../../../Common/Common.css';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { IPropertyModel } from '@drk/src/Model/IPropertyModel';
import { Dictionary } from 'ts-essentials';
import DefaultModelCustomizer from '@drk/src/Model/DefaultModelCustomizer';
import { IFormField } from '@drk/src/Components/Forms';
import '@drk/src/Components/DarkenginesForm/DarkenginesForm';

declare global {
	interface HTMLElementTagNameMap {
		'drk-model-admin': ModelAdmin;
	}
}

export interface IModelAdminProps {
	error?: string;
	fields: IFormField[];
	model: IEntityModel;
}

@customElement('drk-model-admin')
export class ModelAdmin extends LitElement {
	@property({ type: Object })
	public props: IModelAdminProps;
	public save: (userProfileProps: IModelAdminProps) => Promise<IModelAdminProps>;
	public static get styles() {
		return [unsafeCSS(commonCss)];
	}

	render() {
		return html`
			<drk-form
				.darkenginesAdminProps=${{ fields: this.props.fields.toDictionary(field => field.name), model: this.props.model }}
			></drk-form>
		`;
	}
}