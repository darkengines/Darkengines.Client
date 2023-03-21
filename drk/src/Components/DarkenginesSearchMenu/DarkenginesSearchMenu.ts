import { msg } from '@lit/localize';
import { List } from '@material/mwc-list';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import { TextField } from '@material/mwc-textfield';
import { css, html, LitElement } from 'lit';
import { customElement, property, query, queryAssignedNodes } from 'lit/decorators.js';
import { scrollbarStyle } from '../../Styles/scrollbar';

export interface IDarkenginesSearchMenuProps {
	filterValue?: string;
}

export interface IDarkenginesSearchMenuActions {
	filterValueChanged: (
		props: IDarkenginesSearchMenuProps
	) => Promise<IDarkenginesSearchMenuProps>;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-search-menu': DarkenginesSearchMenu;
	}
}
@customElement('drk-search-menu')
export class DarkenginesSearchMenu extends LitElement {
@property({ attribute: false })
	public props: IDarkenginesSearchMenuProps;
	protected surfaceProps: Partial<MenuSurface>;
	@property({ type: Object })
	set menuSurface(value: Partial<MenuSurface>) {
		this.surfaceProps = { ...this.surfaceProps, ...value };
		this.updateComplete.then(() => Object.assign(this.menu, this.surfaceProps));
	}
	get menuSurface(): Partial<MenuSurface> {
		return this.surfaceProps;
	}
	get filter(): TextField {
		return this.filterInput;
	}
	@property({ attribute: false })
	actions: IDarkenginesSearchMenuActions;
	@query('#menu')
	menu: MenuSurface;
	@query('#results')
	results: List;
	@queryAssignedNodes()
	listItemsElement: HTMLElement[];
	@query('#filter-input')
	filterInput: TextField;

	async connectedCallback() {
		super.connectedCallback();
		await this.updateComplete;
	}

	public static get styles() {
		return [
			scrollbarStyle,
			css`
				:host {
					display: content;
					--mdc-menu-max-height: unset;
				}
				* {
					box-sizing: border-box;
				}
				#menu {
				}
				#filter {
					padding: calc(var(--content-padding) / 2);
				}
				#filter-input {
					width: 100%;
				}
				#results {
					max-height: 256px;
					overflow-y: auto;
				}
				mwc-menu-surface {
					z-index: 1;
				}
			`,
		];
	}
	render() {
		return html`
			<mwc-menu-surface
				@closed=${(e) => {
					this.menuSurface = {
						...this.menuSurface,
						open: false,
					};
				}}
				id="menu"
				@keydown=${(e: KeyboardEvent) => {
					if (e.key == 'ArrowDown') {
						if (this.results.getFocusedItemIndex() < 0) {
							this.results.focusItemAtIndex(0);
						}
					} else if (e.key == 'ArrowUp') {
						if (this.results.getFocusedItemIndex() < 0) {
							this.results.focusItemAtIndex(this.results.items.length - 1);
						}
					} else if (e.key == 'Tab' || e.key == 'Enter') {
						const child = this.listItemsElement.filter(
							(node) => node.nodeType == Node.ELEMENT_NODE
						)[this.results.getFocusedItemIndex()];
						if (child instanceof HTMLElement) {
							child.click();
							e.preventDefault();
							return false;
						}
					} else {
						this.filterInput.focus();
					}
					return true;
				}}
			>
				<div id="filter">
					<mwc-textfield
						placeholder="${msg('Search')}"
						outlined
						id="filter-input"
						iconTrailing="search"
						.value=${this.props.filterValue ?? ''}
						@input=${async (e: CustomEvent) => {
							this.props = await this.actions.filterValueChanged({
								...this.props,
								filterValue: this.filterInput.value,
							});
						}}
					></mwc-textfield>
				</div>
				<mwc-list wrapFocus rootTabbable id="results"> <slot></slot> </mwc-list
			></mwc-menu-surface>
		`;
	}
}
