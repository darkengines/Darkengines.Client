import { DarkenginesButton } from '@drk/src/Components/DarkenginesButton/DarkenginesButton';
import { DarkenginesLightTextfield } from '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import { getUnhandledErrorMessage, getUnhandledErrorRetryMessage } from '@drk/src/Errors';
import { mdcElevation, mdcTextfield, mdcTypography } from '@drk/src/Styles/Material/index';
import {
	IPropertyValidationState,
	isValid,
	IValidationState,
	validate,
} from '@drk/src/Validation/ValidationState';
import { msg } from '@lit/localize';
import { Checkbox } from '@material/mwc-checkbox';
import { Snackbar } from '@material/mwc-snackbar';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Dictionary } from 'ts-essentials';
import { validateEmailAddress, validateLogin } from '../../validators';
import { defaultHeader, form, signInFooter } from '../../../Common/Common';
import './Signup.css';

export interface ISignUpValidationState extends Dictionary<IPropertyValidationState> {
	emailAddress?: IPropertyValidationState;
	login?: IPropertyValidationState;
	password?: IPropertyValidationState;
	passwordConfirmation?: IPropertyValidationState;
	gcu?: IPropertyValidationState;
}

function isFormValid<TForm extends Dictionary<IPropertyValidationState>>(form: TForm) {
	return form && Object.entries(form).every(([key, field]) => field.isValid);
}

export interface ISignup {
	emailAddress: string;
	login: string;
	password: string;
	passwordConfirmation: string;
	validationState: ISignUpValidationState;
	signup(signUp: ISignup): Promise<ISignup>;
	lastError: unknown;
	loading: boolean;
	gcuAgreement: boolean;

	goToLogin: () => Promise<any>;
}

export interface ISignupProps {
	emailAddress: string;
	login: string;
	password: string;
	gcuAgreement: boolean;
	loading: boolean;
	passwordConfirmation: string;
	lastError: unknown;
}

let validators = {
	login: (signupProps: ISignupProps, validationState: IValidationState<ISignupProps>) =>
		validateLogin(signupProps, validationState),
	emailAddress: (signupProps: ISignupProps, validationState: IValidationState<ISignupProps>) =>
		validateEmailAddress(signupProps, validationState),
	password: (signupProps: ISignupProps, validationState: IValidationState<ISignupProps>) => {
		const isPasswordValid = signupProps.password && signupProps.password.trim().length >= 8;
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
		signupProps: ISignupProps,
		validationState: IValidationState<ISignupProps>
	) => {
		const isPasswordConfirmationValid =
			signupProps.password === signupProps.passwordConfirmation;
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
	gcuAgreement: (signupProps: ISignupProps, validationState: IValidationState<ISignupProps>) => {
		let message = undefined;
		if (!signupProps.gcuAgreement)
			message = msg('You must read and accept the GCU.', {
				id: 'signup.gcu.missingGcuAgreement',
			});

		validationState = {
			...validationState,
			gcuAgreement: {
				isValid: signupProps.gcuAgreement,
				message,
			},
		};
		return validationState;
	},
};

export interface ISignupActions {
	goToGcu: (props: ISignupProps) => ISignupProps;
	signUp: (props: ISignupProps) => Promise<ISignupProps>;
	goToSignIn: (props: ISignupProps) => ISignupProps;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-signup': Signup;
	}
}
@customElement('drk-signup')
export class Signup extends LitElement {
@property()
	props: ISignupProps;
	actions: ISignupActions;
	@property()
	validationState: IValidationState<ISignupProps>;
	@property()
	public signup: (signUp: ISignup) => Promise<ISignup>;
	@property({ type: Object })
	public lastError: unknown;
	@property({ type: String })
	public gcuUrl: string;
	@query('.error-snackbar')
	protected errorSnackbar: Snackbar;
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
	}
	public render() {
		return form(
			defaultHeader(),
			html`<div
					@keyup=${(e: KeyboardEvent) => {
						if (e.key == 'Enter') {
							this.submitButton.click();
						}
					}}
					class="body"
				>
					<drk-light-textfield
						autocomplete="off"
						id="login"
						placeholder="john"
						helperText=${msg('Your login will be displayed to other users')}
						label=${msg('Login')}
						name="login"
						type="text"
						validationMessage=${this.validationState?.login?.message}
						value=${this.props.login}
						@change=${(e: Event) =>
							this.loginChanged(e.currentTarget as DarkenginesLightTextfield)}
						?isValid=${this.validationState?.login?.isValid ?? true}
					></drk-light-textfield>
					<drk-light-textfield
						id="email"
						autocomplete="off"
						placeholder="john@gmail.com"
						helperText=${msg('We will contact you there')}
						label=${msg('Email address')}
						name="email"
						.isValid=${this.validationState?.emailAddress?.isValid}
						validationMessage=${this.validationState?.emailAddress?.message}
						type="email"
						@change=${(e: Event) =>
							this.emailChanged(e.currentTarget as DarkenginesLightTextfield)}
						value=${this.props.emailAddress}
					></drk-light-textfield>
					<drk-light-textfield
						autocomplete="off"
						id="password"
						helperText=${msg('At least 8 characters')}
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
					<div id="gcu">
						<mwc-formfield
							id="gcu-field"
							alignEnd
							class="${classMap({
								error: this.validationState?.gcuAgreement?.isValid === false,
							})}"
							label=${msg('I have read and I accept the GCU', {
								id: 'signup.gcu.label',
							})}
						>
							<mwc-checkbox
								.checked=${this.props.gcuAgreement}
								@change=${(e: Event) =>
									this.gcuChanged(e.currentTarget as Checkbox)}
							></mwc-checkbox>
						</mwc-formfield>
						<div id="gcu-text" class="mdc-typography--caption">
							${msg(
								html`Click <a target="_blank" href=${this.gcuUrl}><b>here</b></a> to
									read the GCU.`
							)}
						</div>
						<div id="gcu-error" class="mdc-typography--caption error">
							${this.validationState?.gcuAgreement?.message}
						</div>
					</div>
					<drk-button
						id="submit"
						class="submit"
						unelevated
						?isLoading=${this.props.loading}
						hasLoader
						@click=${(e: MouseEvent) => this.submit()}
						>${msg('Sign up', { id: 'signup.submit.label' })}</drk-button
					>
				</div>
				<mwc-snackbar class="error-snackbar" labelText=${getUnhandledErrorMessage()}>
					<drk-button
						?isLoading=${this.props.loading}
						@click=${(e: MouseEvent) => this.submit()}
						slot="action"
						>${getUnhandledErrorRetryMessage()}</drk-button
					>
				</mwc-snackbar>`,
			signInFooter(this.props, this.actions)
		);
	}
	async submit() {
		this.validationState = validate(
			this.props,
			this.validationState,
			...Object.values(validators)
		);
		if (isValid(this.validationState)) {
			try {
				this.props.loading = true;
				await this.actions.signUp(this.props);
			} catch (error) {
				this.errorSnackbar.show();
				this.lastError = error;
			} finally {
				this.props.loading = false;
			}
		}
	}

	loginChanged(loginInput: DarkenginesLightTextfield) {
		this.props.login = loginInput.value;
		this.validationState = validate(this.props, this.validationState, validators.login);
	}
	emailChanged(emailInput: DarkenginesLightTextfield) {
		this.props.emailAddress = emailInput.value;
		this.validationState = validate(this.props, this.validationState, validators.emailAddress);
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
	gcuChanged(gcuCheckbox: Checkbox) {
		this.props.gcuAgreement = gcuCheckbox.checked;
		this.validationState = validate(this.props, this.validationState, validators.gcuAgreement);
	}
}
