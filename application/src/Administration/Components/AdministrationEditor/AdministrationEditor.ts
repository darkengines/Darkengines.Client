import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'drk-administration-editor': AdministrationEditor;
	}
}

@customElement('drk-administration-editor')
export class AdministrationEditor extends LitElement {
    public render() {
        html`Editor`;
    }
}
