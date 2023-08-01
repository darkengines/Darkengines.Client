import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'drk-user-account': UserAccount;
	}
}

@customElement('drk-user-account')
export class UserAccount extends LitElement {
	render() {
		return html`UserAccount`;
	}
}
