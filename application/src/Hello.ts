import { html } from 'lit';
import { LitElement } from 'lit-element/lit-element.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('drk-hello')
export default class Hello extends LitElement {
	@property()
	public name: string;
	public render() {
		return html`<div>Hello ${this.name} !</div>`;
	}
}
