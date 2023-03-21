import '@material/mwc-list/mwc-list';
import { List } from '@material/mwc-list/mwc-list';
import { ListItemBase } from '@material/mwc-list/mwc-list-item-base';
import '@material/mwc-menu/mwc-menu-surface';
import { MenuSurface } from '@material/mwc-menu/mwc-menu-surface';
import '@material/mwc-notched-outline/mwc-notched-outline';
import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { mwcTextfieldStyles } from '../../Styles/Material';;

declare global {
	interface HTMLElementTagNameMap {
		'drk-multi-select': DarkenginesMultiSelect;
	}
}
@customElement('drk-multi-select')
export class DarkenginesMultiSelect extends LitElement {
@query('#input')
	protected input: HTMLInputElement;
	@query('#menuSurface')
	protected menuSurface: MenuSurface;
	@query('slot[name=search-result-item]')
	protected searchResultItemSlot: HTMLSlotElement;
	@query('#inputWrapper')
	protected inputWrapper: HTMLDivElement;
	@query('#searchResultList')
	protected searchResultList: List;
	@property({ type: Boolean })
	public allowCustomItems: boolean;
	@property({ type: String })
	public label: string;
	@property({ type: String })
	public placeholder: string;
	@property({ type: String })
	public validationMessage: string;
	@state()
	protected selectedSearchResultItemIndex: number;
	@state()
	protected hasSearchResultItems: boolean = false;
	@state()
	protected hasFocus: boolean = false;

	firstUpdated(changedProperties: PropertyValues) {
		this.menuSurface.anchor = this.inputWrapper;
		super.firstUpdated(changedProperties);
	}

	public static get styles() {
		return [
			mwcTextfieldStyles,
			css`
				:host {
					display: inline-block;
				}
				.mdc-text-field__input::-webkit-input-placeholder {
					opacity: 1;
				}
				#input {
					min-width: 128px;
				}
				#container {
					position: relative;
					padding: var(--content-padding);
					display: flex;
					flex-flow: row wrap;
					grid-gap: calc(var(--content-spacing) / 2);
					min-height: 72px;
					justify-items: start;
					align-items: center;
					height: auto;
					z-index: 1;
				}
				#inputWrapper {
					position: relative;
					display: inline-block;
				}
				#menuSurface {
					z-index: 2;
				}
				.mdc-text-field-helper-text--validation-msg {
					opacity: 1;
					color: var(--mdc-theme-error, #b00020);
				}
			`,
		];
	}
	protected onInputKeyDown(keyboardEvent: KeyboardEvent) {
		if (keyboardEvent.key == 'ArrowDown') {
			this.selectedSearchResultItemIndex =
				(this.searchResultList.selected
					? this.searchResultList.items.indexOf(
							this.searchResultList.selected as ListItemBase
					  ) + 1
					: 0) % this.searchResultList.items.length;
			this.searchResultList.select(this.selectedSearchResultItemIndex);
			keyboardEvent.preventDefault();
			return false;
		} else if (keyboardEvent.key == 'ArrowUp') {
			this.selectedSearchResultItemIndex =
				(((this.searchResultList.selected
					? this.searchResultList.items.indexOf(
							this.searchResultList.selected as ListItemBase
					  ) - 1
					: 0) %
					this.searchResultList.items.length) +
					this.searchResultList.items.length) %
				this.searchResultList.items.length;
			this.searchResultList.select(this.selectedSearchResultItemIndex);
			keyboardEvent.preventDefault();
			return false;
		} else if (keyboardEvent.key == 'Tab' || keyboardEvent.key == 'Enter') {
			if (
				this.searchResultList.selected &&
				!(this.searchResultList.selected instanceof Array)
			) {
				this.searchResultList.selected.click();
				this.searchResultList.select(-1);
				this.input.value = '';
			} else if (this.allowCustomItems) {
				if (this.input.value && this.input.value.trim() !== '') {
					this.dispatchEvent(
						new CustomEvent<string>('custom-item', { detail: this.input.value })
					);
					this.input.value = '';
				}
			}
			keyboardEvent.preventDefault();
			return false;
		}
		return true;
	}
	render() {
		return html`
			<div
				id="container"
				class="mdc-text-field ${classMap({
					'mdc-text-field--focused': this.hasFocus,
					'mdc-text-field--invalid':
						this.validationMessage && this.validationMessage.length,
				})} mdc-text-field--outlined mdc-text-field--label-floating"
				@click=${(e: MouseEvent) => {
					this.input.focus();
				}}
			>
				<mwc-notched-outline open class="mdc-notched-outline">
					<span
						style="top:0;font-size: 0.75rem;"
						class="mdc-floating-label ${classMap({
							//'mdc-floating-label--required': this.required,
						})} "
						>${this.label}</span
					>
				</mwc-notched-outline>
				<slot name="item"></slot>
				<div id="inputWrapper">
					<input
						placeholder="${this.placeholder ?? ''}"
						autocomplete="off"
						id="input"
						type="text"
						class="mdc-text-field__input"
						@input=${(e: InputEvent) => {
							this.dispatchEvent(
								new CustomEvent<string>('search-input', {
									detail: this.input.value,
								})
							);
						}}
						@focus=${(e: Event) => {
							this.hasFocus = true;
						}}
						@blur=${(e: FocusEvent) => {
							const hasFocus =
								e.relatedTarget instanceof HTMLElement &&
								e.relatedTarget.assignedSlot == this.searchResultItemSlot &&
								e.relatedTarget.assignedSlot == this.searchResultItemSlot;
							if (hasFocus) {
								this.input.value = '';
								this.input.focus();
								e.preventDefault();
								return false;
							} else {
								this.hasFocus = false;
							}
							return true;
						}}
						@keydown=${this.onInputKeyDown.bind(this)}
					/>
					<mwc-menu-surface
						quick
						?open=${this.hasFocus && this.hasSearchResultItems}
						stayOpenOnBodyClick
						id="menuSurface"
						corner="BOTTOM_LEFT"
					>
						<mwc-list
							@items-updated=${(e: Event) =>
								(this.hasSearchResultItems = !!(e.currentTarget as List).items
									.length)}
							activatable
							id="searchResultList"
						>
							<slot name="search-result-item"></slot>
						</mwc-list>
					</mwc-menu-surface>
				</div>
			</div>
			<div
				class="mdc-text-field-helper-line mdc-text-field-helper-text mdc-text-field-helper-text--validation-msg"
			>
				${this.validationMessage}
			</div>
		`;
	}
}
