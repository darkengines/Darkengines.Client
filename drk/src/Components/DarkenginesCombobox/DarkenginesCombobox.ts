import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import { TextField } from '@material/mwc-textfield';
import { html, LitElement, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

export interface IDarkenginesComboboxProps<T> {
	value: string;
	label: string;
	placeholder: string;
	surfaceProps: Partial<MenuSurface>;
	autoCompleteValues: Array<T>;
}

export interface IDarkenginesComboboxActions<T> {
	inputTextfieldCallback: (props: IDarkenginesComboboxProps<T>) => void;
	autoCompleteCallback: (props: IDarkenginesComboboxProps<T>) => void;
	renderAutoCompleteTemplate: <T>(value: T) => TemplateResult;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-combobox': DarkenginesCombobox;
	}
}
@customElement('drk-combobox')
export class DarkenginesCombobox extends LitElement {
@property({ type: Object })
	protected _props: IDarkenginesComboboxProps<unknown>;
	@property({ type: Boolean })
	protected open: boolean;
	@property({ type: Boolean })
	protected hasFocus: boolean;
	public actions: IDarkenginesComboboxActions<any>;

	@property({ attribute: false })
	set props(value: IDarkenginesComboboxProps<unknown>) {
		this._props = { ...this._props, ...value };
		this.open =
			!!this._props.autoCompleteValues.length &&
			this._props.value &&
			!!this._props.value.trim().length;
		if (this._props?.surfaceProps)
			this.updateComplete.then(() => Object.assign(this.menu, this._props.surfaceProps));
		if (this.menu) this.menu.requestUpdate();
	}
	get props(): IDarkenginesComboboxProps<unknown> {
		return this._props;
	}

	@query('#menu')
	menu: MenuSurface;
	@query('#autoCompleteTextField')
	autoCompleteTextField: TextField;

	renderMenu() {
		return html`
			<mwc-menu-surface
				id="menu"
				.anchor=${this.props?.surfaceProps?.anchor ?? this.autoCompleteTextField}
				.open=${this.open && this.hasFocus}
				@click=${(e) => this.menu.close()}
				@closed=${(e) => (this.open = false)}
			>
				<mwc-list wrapFocus rootTabbable id="results">
					${repeat(this.props.autoCompleteValues, (value) =>
						this.actions.renderAutoCompleteTemplate(value)
					)}
				</mwc-list>
			</mwc-menu-surface>
		`;
	}
	render() {
		return html`
			<mwc-textfield
				part="textfield"
				outlined
				required
				id="autoCompleteTextField"
				.label=${this.props.label}
				.placeholder=${this.props.placeholder}
				.value=${this.props.value ?? ''}
				@input=${(e: Event) => {
					let value = (e.currentTarget as TextField).value;
					if (!value.trim().length) value = undefined;
					this.props = { ...this.props, value };
					if (this.actions.inputTextfieldCallback)
						this.actions.inputTextfieldCallback(this.props);
					if (this.actions.autoCompleteCallback)
						this.actions.autoCompleteCallback(this.props);
				}}
				@focus=${(e) => {
					this.hasFocus = true;
				}}
				@blur=${(e) => {
					this.hasFocus = false;
				}}
			></mwc-textfield>
			${this.renderMenu()}
		`;
	}
}
