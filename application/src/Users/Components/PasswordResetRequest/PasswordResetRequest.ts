import { DarkenginesButton } from '@drk/src/Components/DarkenginesButton/DarkenginesButton';
import { DarkenginesLightTextfield } from '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import { mdcElevation, mdcTextfield, mdcTypography } from '@drk/src/Styles/Material/index';
import { IPropertyValidationState } from '@drk/src/Validation/ValidationState';
import { msg } from '@lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { defaultHeader, form, signInFooter } from '../Common/Common';
import './PasswordResetRequest.css';

export interface IPasswordResetRequestValidationState {
	emailAddress?: IPropertyValidationState;
}

export interface IPasswordResetRequest {
	emailAddress: string;
	validationState: IPasswordResetRequestValidationState;
	onSubmit(signUp: IPasswordResetRequest): Promise<IPasswordResetRequest>;
	lastError: unknown;
	loading: boolean;
}

export interface IPasswordResetRequestProps {
	emailAddress: string;
}

export interface IPasswordResetRequestActions {
	goToSignIn: (props: IPasswordResetRequestProps) => IPasswordResetRequestProps;
}

@customElement('drk-password-reset-request')
export class PasswordResetRequest extends LitElement {
	@property({ type: String })
	public props: IPasswordResetRequestProps;
	public actions: IPasswordResetRequestActions;
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
					helperText=${msg('We will contact you there')}
					label=${msg('Email address')}
					name="email"
					type="email"
					@change=${(e: Event) =>
						this.emailChanged(e.currentTarget as DarkenginesLightTextfield)}
					value=${this.props.emailAddress}
				></drk-light-textfield>
				<drk-button class="submit" unelevated
					>${msg('Request password reset', {
						id: 'password-reset-request.submit.label',
					})}</drk-button
				>
			</div>`,
			signInFooter(this.props, this.actions)
		);
	}

	emailChanged(emailInput: DarkenginesLightTextfield) {
		this.props;
	}
}
