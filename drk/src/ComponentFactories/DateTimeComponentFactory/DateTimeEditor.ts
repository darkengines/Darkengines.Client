import { TextField } from '@material/mwc-textfield';
import { format } from 'date-fns';
import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { IValidatable } from '../../Components/IValidatable';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IEditorComponentProps, IEditorComponentActions } from '../IComponentFactory';
import { DarkenginesTextfield } from '../../Components/DarkenginesTextfield/DarkenginesTextfield';

declare global {
	interface HTMLElementTagNameMap {
		'drk-date-time-editor': DateTimeEditor;
	}
}
@customElement('drk-date-time-editor')
export class DateTimeEditor extends LitElement implements IValidatable {
@property({ type: Object })
	public props: IEditorComponentProps<IPropertyModel, Date | string, TextField>;
	public actions: IEditorComponentActions<IPropertyModel, Date>;
	@query('drk-textfield')
	comeetTextfield: DarkenginesTextfield;
	@property({ type: Boolean })
	formNoValidate?: boolean;
	@property({ type: Boolean })
	required?: boolean;
	@property({ type: String })
	label?: string;
	@property({ type: String })
	placeholder?: string;
	@property({ type: Object })
	get validity(): ValidityState {
		return this.comeetTextfield.validity;
	}
	@property({ type: String })
	get validationMessage(): string {
		return this.comeetTextfield.validationMessage;
	}
	@property({ type: Boolean })
	get willValidate(): boolean {
		return this.comeetTextfield.willValidate;
	}
	setCustomValidity(message?: string) {
		this.updateComplete.then((_) => this.comeetTextfield.setCustomValidity(message));
	}
	checkValidity(): boolean {
		return this.comeetTextfield.checkValidity();
	}
	reportValidity(): boolean {
		return this.comeetTextfield.reportValidity();
	}
	render() {
		const date =
			this.props?.value instanceof Date
				? this.props.value
				: this.props.value
				? new Date(this.props.value)
				: new Date();
		const value = (this.props && this.props.value && format(date, "yyyy-MM-dd'T'HH:mm")) ?? '';
		return html`<drk-textfield
			part="textfield"
			style="max-width: 256px;"
			outlined
			type="datetime-local"
			?formNoValidate=${this.formNoValidate}
			?required=${this.required}
			.label=${this.label}
			.placeholder=${this.placeholder}
			${ref((element: DarkenginesTextfield) => {
				if (element && this.props.component) {
					Object.keys(this.props.component).forEach(
						(key) => (element[key] = this.props.component[key])
					);
				}
			})}
			@invalid=${(e) => this.dispatchEvent(new CustomEvent('invalid'))}
			value="${value}"
			@input=${(e: Event) => {
				let value: Date | undefined = new Date((e.currentTarget as TextField).value);
				if (isNaN(value.getTime())) value = undefined;
				this.actions.valueChanged?.({ ...this.props, value });
			}}
		></drk-textfield>`;
	}
}
