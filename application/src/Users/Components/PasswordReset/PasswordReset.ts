import { msg } from '@lit/localize';
import { LitElement, css, html, svg } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { mdcElevation, mdcTextfield, mdcTypography } from '@drk/src/Styles/Material/index';
import logo from '../../../../assets/images/logo.svg';
import config from '../../../../config/appsettings.config.json';
import './PasswordReset.css';
import { DarkenginesLightTextfield } from '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import {
	IPropertyValidationState,
	IValidationState,
	validate,
} from '@drk/src/Validation/ValidationState';
import { defaultHeader, form, signUpFooter } from '../../../Common/Common';
import { DarkenginesButton } from '@drk/src/Components/DarkenginesButton/DarkenginesButton';

export interface IPasswordResetProps {
	password: string;
	passwordConfirmation: string;
	lastError: unknown;
	loading: boolean;
}

export interface IPasswordResetActions {
	resetPassword: (props: IPasswordResetProps) => IPasswordResetProps;
	goToSignup: (props: IPasswordResetProps) => IPasswordResetProps;
}

let validators = {
	password: (
		resetPasswordProps: IPasswordResetProps,
		validationState: IValidationState<IPasswordResetProps>
	) => {
		const isPasswordValid =
			resetPasswordProps.password && resetPasswordProps.password.trim().length >= 8;
		if (!isPasswordValid) {
			validationState = {
				...validationState,
				password: {
					isValid: isPasswordValid,
					message: msg('You password must contains at least 8 characters', {
						id: 'signup.password.invalid',
					}),
				},
			};
		} else {
			validationState = {
				...validationState,
				password: {
					isValid: isPasswordValid,
				},
			};
		}
		return validationState;
	},
	passwordConfirmation: (
		resetPasswordProps: IPasswordResetProps,
		validationState: IValidationState<IPasswordResetProps>
	) => {
		const isPasswordConfirmationValid =
			resetPasswordProps.password === resetPasswordProps.passwordConfirmation;
		const isPasswordValid =
			validationState.password.isValid === undefined || validationState.password.isValid;
		if (isPasswordValid && !isPasswordConfirmationValid) {
			validationState = {
				...validationState,
				passwordConfirmation: {
					isValid: isPasswordConfirmationValid,
					message: msg('Your passwords do not match.', {
						id: 'signup.passwordConfirmation.invalid',
					}),
				},
			};
		} else {
			validationState = {
				...validationState,
				passwordConfirmation: {
					isValid: true,
				},
			};
		}
		return validationState;
	},
};

declare global {
	interface HTMLElementTagNameMap {
		'drk-password-reset': PasswordReset;
	}
}
@customElement('drk-password-reset')
export class PasswordReset extends LitElement {
@property()
	public props: IPasswordResetProps;
	public actions: IPasswordResetActions;
	@property()
	public validationState: IValidationState<IPasswordResetProps>;
	@query('#submit')
	protected submitButton: DarkenginesButton;

	public static get styles() {
		return [mdcElevation, mdcTypography, mdcTextfield, css``];
	}
	protected createRenderRoot(): Element | ShadowRoot {
		return this;
	}
	async connectedCallback(): Promise<void> {
		super.connectedCallback();
		await this.updateComplete;
	}

	public render() {
		return form(
			defaultHeader(),
			html`<div
				class="body"
				@keyup=${(e: KeyboardEvent) => {
					if (e.key == 'Enter') {
						this.submitButton.click();
					}
				}}
			>
				<drk-light-textfield
					id="password"
					helperText="At least 8 characters"
					label=${msg('Password')}
					name="password"
					type="password"
					value=${this.props.password}
					@change=${(e: Event) =>
						this.passwordChanged(e.currentTarget as DarkenginesLightTextfield)}
					.isValid=${this.validationState?.password?.isValid}
					.validationMessage=${this.validationState?.password?.message}
				></drk-light-textfield>
				<drk-light-textfield
					id="repeat-password"
					helperText=${msg('Just retype your password')}
					label=${msg('Repeat password')}
					name="repeat-password"
					type="password"
					value=${this.props.passwordConfirmation}
					@change=${(e: Event) =>
						this.passwordConfirmationChanged(
							e.currentTarget as DarkenginesLightTextfield
						)}
					.isValid=${this.validationState?.passwordConfirmation?.isValid}
					.validationMessage=${this.validationState?.passwordConfirmation?.message}
				></drk-light-textfield>
				<drk-button class="submit" unelevated
					>${msg('Set new password', {
						id: 'password-reset.submit.label',
					})}</drk-button
				>
			</div>`,
			signUpFooter(this.props, this.actions)
		);
	}
	passwordChanged(passwordInput: DarkenginesLightTextfield) {
		this.props.password = passwordInput.value;
		this.validationState = validate(this.props, this.validationState, validators.password);
	}
	passwordConfirmationChanged(passwordConfirmationInput: DarkenginesLightTextfield) {
		this.props.passwordConfirmation = passwordConfirmationInput.value;
		this.validationState = validate(
			this.props,
			this.validationState,
			validators.passwordConfirmation
		);
	}
}
