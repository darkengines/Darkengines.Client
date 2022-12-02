import { css } from 'lit';

const darkenginesTextfieldStyles = css`
	.drk-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before {
		border-bottom-color: #b00020 !important;
		/* @alternate */
		border-bottom-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {
		border-bottom-color: #b00020 !important;
		/* @alternate */
		border-bottom-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label {
		color: #b00020 !important;
		/* @alternate */
		color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled).drk-text-field--invalid
		+ .mdc-text-field-helper-line
		.mdc-text-field-helper-text--validation-msg {
		color: #b00020 !important;
		/* @alternate */
		color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid .mdc-text-field__input {
		caret-color: #b00020 !important;
		/* @alternate */
		caret-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing {
		color: #b00020 !important;
		/* @alternate */
		color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before {
		border-bottom-color: #b00020 !important;
		/* @alternate */
		border-bottom-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
	.drk-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
		border-color: #b00020 !important;
		/* @alternate */
		border-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover
		.mdc-notched-outline
		.mdc-notched-outline__leading,
	.drk-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover
		.mdc-notched-outline
		.mdc-notched-outline__notch,
	.drk-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover
		.mdc-notched-outline
		.mdc-notched-outline__trailing {
		border-color: #b00020 !important;
		/* @alternate */
		border-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
		.mdc-notched-outline__leading,
	.drk-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
		.mdc-notched-outline__notch,
	.drk-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused
		.mdc-notched-outline__trailing {
		border-color: #b00020 !important;
		/* @alternate */
		border-color: var(--mdc-theme-error, #b00020) !important;
	}
	.drk-text-field--invalid
		+ .mdc-text-field-helper-line
		.mdc-text-field-helper-text--validation-msg {
		opacity: 1;
	}
`;

export { darkenginesTextfieldStyles };
