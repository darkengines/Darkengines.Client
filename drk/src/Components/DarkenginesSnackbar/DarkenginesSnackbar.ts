import { Snackbar } from '@material/mwc-snackbar';
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

declare global {
	interface HTMLElementTagNameMap {
		'drk-snackbar': DarkenginesSnackbar;
	}
}
@customElement('drk-snackbar')
export class DarkenginesSnackbar extends Snackbar {
public static get styles() {
		return [
			...Snackbar.styles,
			css`
				.mdc-snackbar {
					position: absolute;
					bottom: var(--drk-snackbar-bottom, 0);
				}
			`,
		];
	}
}
