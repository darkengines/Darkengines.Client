import { html } from 'lit';
import { MdRipple } from '@material/web/ripple/ripple';

export interface IUserMenuItem {
	name: string;
	display: any;
	onClick: (e: MouseEvent) => void;
	isSelected: boolean;
}
export function userMenuItem(userMenuItem: IUserMenuItem) {
	return html`<div
		class="user-menu-item"
		?selected=${userMenuItem.isSelected}
		@click=${(e: MouseEvent) => userMenuItem.onClick(e)}
	>
		<md-ripple></md-ripple>
		${userMenuItem.display}
	</div>`;
}
