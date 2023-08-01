import { html } from 'lit';
import { MdRipple } from '@material/web/ripple/ripple';

export interface IApplicationMenuItem {
	name: string;
	display: any;
	onClick: (e: MouseEvent) => void;
	isSelected: boolean;
}
export function applicationMenuItem(applicationMenuItem: IApplicationMenuItem) {
	return html`<div
		class="application-menu-item"
		?selected=${applicationMenuItem.isSelected}
		@click=${(e: MouseEvent) => applicationMenuItem.onClick(e)}
	>
		<md-ripple></md-ripple>
		${applicationMenuItem.display}
	</div>`;
}
