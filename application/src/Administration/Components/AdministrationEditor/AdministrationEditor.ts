import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@drk/src/Components/DarkenginesForm/DarkenginesForm';
import { IFormActions, IFormProps } from '@drk/src/Components/Forms';

declare global {
	interface HTMLElementTagNameMap {
		'drk-administration-editor': AdministrationEditor;
	}
}

export interface IAdministratorEditorProps {
	form: IFormProps;
}

export interface IAdministratorEditorActions {
	form: IFormActions;
}

@customElement('drk-administration-editor')
export class AdministrationEditor extends LitElement {
	@property({ type: Object })
	public props: IAdministratorEditorProps;
    @property({ type: Object })
	public actions: IAdministratorEditorActions;

	public render() {
		return html`<drk-form
			.darkenginesAdminProps=${this.props.form}
			.darkenginesAdminActions=${this.actions.form}
		></drk-form>`;
	}
}
