import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'drk-user-security': UserSecurity;
	}
}

@customElement('drk-user-security')
export class UserSecurity extends LitElement {
	render() {
		return html`UserSecurity`;
	}
}
