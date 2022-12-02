import { Menu } from '@material/mwc-menu';
import { html } from 'lit-element';
import { customElement } from 'lit/decorators.js';

@customElement('drk-drop-down')
export default class DropDown extends Menu {
	public static get styles() {
		return Menu.styles;
	}

	render() {
		const itemRoles = this.innerRole === 'menu' ? 'menuitem' : 'option';
		return html` <drop-down-surface
			?hidden=${!this.open}
			.anchor=${this.anchor}
			.open=${this.open}
			.quick=${this.quick}
			.corner=${this.corner}
			.x=${this.x}
			.y=${this.y}
			.absolute=${this.absolute}
			.fixed=${this.fixed}
			.fullwidth=${this.fullwidth}
			.menuCorner=${this.menuCorner}
			?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
			class="mdc-menu mdc-menu-surface"
			@closed=${this.onClosed}
			@opened=${this.onOpened}
			@keydown=${this.onKeydown}
		>
			<mwc-list
				rootTabbable
				.innerRole=${this.innerRole}
				.multi=${this.multi}
				class="mdc-deprecated-list"
				.itemRoles=${itemRoles}
				.wrapFocus=${this.wrapFocus}
				.activatable=${this.activatable}
				@action=${this.onAction}
			>
				<slot></slot>
			</mwc-list>
		</drop-down-surface>`;
	}
}
