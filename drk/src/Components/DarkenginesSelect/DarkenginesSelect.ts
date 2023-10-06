import { LitElement, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Select } from '@material/web/select/internal/select';

export function selectOption(headline: any) {
	return html`<md-select-option>
		<div slot="headline">${headline}</div>
	</md-select-option>`;
}

@customElement('drk-select')
export class DarkenginesSelect extends LitElement {
	@property({ type: Boolean })
	public quick: boolean;
	@property({ type: String })
	public label: string;
	@property({ type: String })
	public value: string;
	@query('#component')
	protected component: Select;
	@property({ type: Number })
	public set selectedIndex(index: number) {
		this.updateComplete.then(() => {
			this.component.selectedIndex = index;
		});
	}
	public get selectedIndex(): number {
		return this.component.selectedIndex;
	}

	public static get styles() {
		return [css``];
	}

	public render() {
		return html`
			<md-outlined-select
				id="component"
				@input=${(e: Event) => {
					console.log(e);
				}}
				.label=${this.label}
				?quick=${this.quick}
			>
				<slot></slot>
			</md-outlined-select>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-select': DarkenginesSelect;
	}
}
