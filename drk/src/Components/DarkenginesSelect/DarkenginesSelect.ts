import { Select } from '@material/mwc-select';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('drk-select')
export default class DarkenginesSelect extends Select {
	public static get styles() {
		return [
			...Select.styles,
			css`
				.mdc-select--outlined .mdc-select__anchor {
					padding: 0;
				}
				.mdc-select__selected-text-container {
					padding: 0 var(--content-padding);
				}
			`,
		];
	}

	public render() {
		const classes = {
			'mdc-select--disabled': this.disabled,
			'mdc-select--no-label': !this.label,
			'mdc-select--filled': !this.outlined,
			'mdc-select--outlined': this.outlined,
			'mdc-select--with-leading-icon': !!this.icon,
			'mdc-select--required': this.required,
			'mdc-select--invalid': !this.isUiValid,
		};
		const menuClasses = {
			'mdc-select__menu--invalid': !this.isUiValid,
		};
		const describedby = this.shouldRenderHelperText ? 'helper-text' : undefined;
		return html` <div class="mdc-select ${classMap(classes)}">
				<input class="formElement" .value=${this.value} hidden ?required=${this.required} />
				<!-- @ts-ignore -->
				<div
					class="mdc-select__anchor"
					aria-autocomplete="none"
					role="combobox"
					aria-expanded=${this.menuOpen}
					aria-invalid=${!this.isUiValid}
					aria-haspopup="listbox"
					aria-labelledby="label"
					aria-required=${this.required}
					aria-describedby=${ifDefined(describedby)}
					@click=${this.onClick}
					@focus=${this.onFocus}
					@blur=${this.onBlur}
					@keydown=${this.onKeydown}
				>
					${this.renderRipple()}
					${this.outlined ? this.renderOutline() : this.renderLabel()}
					${this.renderLeadingIcon()}
					<span class="mdc-select__selected-text-container">
						<span class="mdc-select__selected-text"
							><slot name="value">${this.value}</slot></span
						>
					</span>
					<span class="mdc-select__dropdown-icon">
						<svg
							class="mdc-select__dropdown-icon-graphic"
							viewBox="7 10 10 5"
							focusable="false"
						>
							<polygon
								class="mdc-select__dropdown-icon-inactive"
								stroke="none"
								fill-rule="evenodd"
								points="7 10 12 15 17 10"
							></polygon>
							<polygon
								class="mdc-select__dropdown-icon-active"
								stroke="none"
								fill-rule="evenodd"
								points="7 15 12 10 17 15"
							></polygon>
						</svg>
					</span>
					${this.renderLineRipple()}
				</div>
				<mwc-menu
					innerRole="listbox"
					wrapFocus
					class="mdc-select__menu mdc-menu mdc-menu-surface ${classMap(menuClasses)}"
					activatable
					.fullwidth=${this.fixedMenuPosition ? false : !this.naturalMenuWidth}
					.open=${this.menuOpen}
					.anchor=${this.anchorElement}
					.fixed=${this.fixedMenuPosition}
					@selected=${this.onSelected}
					@opened=${this.onOpened}
					@closed=${this.onClosed}
					@items-updated=${this.onItemsUpdated}
					@keydown=${this.handleTypeahead}
				>
					<slot></slot>
				</mwc-menu>
			</div>
			${this.renderHelperText()}`;
	}
}
