import { Snackbar } from '@material/mwc-snackbar';
import { css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('drk-snackbar')
export default class DarkenginesSnackbar extends Snackbar {
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
