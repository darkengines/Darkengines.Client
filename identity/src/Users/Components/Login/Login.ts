import { msg } from '@lit/localize';
import { LitElement, css, html, svg } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { mdcElevation, mdcTextfield, mdcTypography } from '@drk/src/Styles/Material/index';
import logo from '../../../../assets/images/logo.svg';
import config from '../../../../config/appsettings.config.json';
import './Login.css';
import '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import '@drk/src/Components/DarkenginesButton/DarkenginesButton';
import { DarkenginesLightTextfield } from '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import { Dictionary } from 'ts-essentials';
import { defaultHeader, form, signUpFooter } from '../Common/Common';
import { DarkenginesButton } from '@drk/src/Components/DarkenginesButton/DarkenginesButton';

export interface ILoginProps {
	login: string;
	password: string;
	isLoading: boolean;
}

export interface ILoginActions {
	goToPasswordResetRequest: (props: ILoginProps) => ILoginProps;
	signIn: (props: ILoginProps) => Promise<ILoginProps>;
	goToSignup: (props: ILoginProps) => ILoginProps;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-login': Login;
	}
}
@customElement('drk-login')
export class Login extends LitElement {
@property()
	public props: ILoginProps;
	public actions: ILoginActions;

	@query('#email')
	protected loginTextfield: DarkenginesLightTextfield;
	@query('#password')
	protected passwordTextfield: DarkenginesLightTextfield;
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
					id="email"
					placeholder="john@gmail.com"
					helperText=${msg('Your login or email address.')}
					label=${msg('Email address')}
					name="email"
					type="email"
					.value=${''}
				></drk-light-textfield>
				<drk-light-textfield
					id="password"
					.helperText=${html`<a
						href="#"
						@click=${(e: MouseEvent) => {
							e.preventDefault();
							return this.actions.goToPasswordResetRequest(this.props);
						}}
						class="forgotPassword mdc-typography--caption"
						>${msg('I forgot my password', { id: 'login.forgotPassword.text' })}</a
					>`}
					label=${msg('Password')}
					name="password"
					type="password"
					.value=${''}
				>
				</drk-light-textfield>
				<drk-button
					hasLoader
					?isLoading=${this.props.isLoading}
					id="submit"
					class="submit"
					@click=${async (e: MouseEvent) => {
						this.props = {
							...this.props,
							isLoading: true,
							login: this.loginTextfield.value,
							password: this.passwordTextfield.value,
						};
						this.props = {
							...(await this.actions.signIn(this.props)),
							isLoading: false,
						};
					}}
					unelevated
					>${msg('Sign in', { id: 'login.submit.label' })}</drk-button
				>
			</div>`,
			signUpFooter(this.props, this.actions)
		);
	}
}
