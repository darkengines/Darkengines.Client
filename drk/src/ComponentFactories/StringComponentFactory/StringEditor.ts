import { TextField } from '@material/mwc-textfield';
import { LitElement, html, css } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { DarkenginesTextfield } from '../../Components/DarkenginesTextfield/DarkenginesTextfield';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IEditorComponentActions, IEditorComponentProps } from '../IComponentFactory';

declare global {
	interface HTMLElementTagNameMap {
		'drk-string-editor': StringEditor;
	}
}
@customElement('drk-string-editor')
export class StringEditor extends LitElement {
@property({ type: String })
	label: string;
	@property({ type: Object })
	public props: IEditorComponentProps<IPropertyModel, string>;
	@query('drk-textfield')
	comeetTextfield: DarkenginesTextfield;
	public get editor(): Promise<DarkenginesTextfield> {
		return this.updateComplete.then((_) => this.comeetTextfield);
	}
	public actions: IEditorComponentActions<IPropertyModel, string>;
	public static get styles() {
		return css`
			:host {
				display: block;
				max-width: 100%;
			}
		`;
	}
	async focus(options: FocusOptions) {
		super.focus(options);
		await this.updateComplete;
		window.requestAnimationFrame((_) => this.comeetTextfield?.focus());
	}
	render() {
		return html`<drk-textfield
			style="min-width: 128px;"
			outlined
			.label=${this.label}
			.placeholder=${this.label}
			.value=${this.props?.value ?? ''}
			${ref((element) => {
				if (element && this.props.component) {
					Object.keys(this.props.component).forEach(
						(key) => (element[key] = this.props.component[key])
					);
				}
			})}
			@input=${(e: Event) => {
				let value = (e.currentTarget as TextField).value;
				if (!value.trim().length) value = undefined;
				this.actions.valueChanged?.({ ...this.props, value });
			}}
		></drk-textfield>`;
	}
}
