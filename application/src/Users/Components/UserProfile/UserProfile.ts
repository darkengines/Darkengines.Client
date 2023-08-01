import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'drk-user-profile': UserProfile;
	}
}

@customElement('drk-user-profile')
export class UserProfile extends LitElement {
	render() {
		return html`UserProfile`;
	}
}
