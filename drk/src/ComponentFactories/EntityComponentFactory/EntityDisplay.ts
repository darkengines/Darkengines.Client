import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { IEntityModel } from '../../Model/IEntityModel';
import { IComponentProps } from '../IComponentFactory';

declare global {
	interface HTMLElementTagNameMap {
		'drk-entity-display': EntityDisplay;
	}
}
@customElement('drk-entity-display')
export class EntityDisplay extends LitElement {
@property({ attribute: false })
	props: IComponentProps<IEntityModel, object>;
	public static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}
	render() {
		return html`${repeat(
			this.props.model.members,
			(member) => member.name,
			(member) => html`
				<div class="field">
					<div class="label">${member.displayName}</div>
					<div class="value">
						${member.componentFactories[0].display(this.props, undefined)}
					</div>
				</div>
			`
		)}`;
	}
}
