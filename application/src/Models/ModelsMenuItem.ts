import { html } from 'lit';
import { MdRipple } from '@material/web/ripple/ripple';

export interface IModelsMenuItem {
	name: string;
	display: any;
	onClick: (e: MouseEvent) => void;
	isSelected: boolean;
}
export function modelsMenuItem(userMenuItem: IModelsMenuItem) {
	return html`<div
		class="models-menu-item"
		?selected=${userMenuItem.isSelected}
		@click=${(e: MouseEvent) => userMenuItem.onClick(e)}
	>
		<md-ripple></md-ripple>
		${userMenuItem.display}
	</div>`;
}
