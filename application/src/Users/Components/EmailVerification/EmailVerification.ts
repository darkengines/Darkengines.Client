import { LitElement, css, html, unsafeCSS, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { mdcElevation, mdcTextfield, mdcTypography } from '@drk/src/Styles/Material/index';
import '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import '@drk/src/Components/DarkenginesButton/DarkenginesButton';
import { defaultHeader, form, signUpFooter } from '../../../Common/Common';
import commonCss from '!raw-loader!../../../Common/Common.css';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import oval from '@drk/src/Components/DarkenginesButton/oval.svg';
import '@material/web/icon/icon.js';
import { msg } from '@lit/localize';

export interface IEmailVerificationProps {
	guid: string;
	isLoading: boolean;
	lastError?: string;
	success: boolean;
}

export interface IEmailVerificationActions {
	verify: (props: IEmailVerificationProps) => Promise<IEmailVerificationProps>;
	onVerificationSuccess: (props: IEmailVerificationProps) => IEmailVerificationProps;
	goToSignup: (props: IEmailVerificationProps) => IEmailVerificationProps;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-email-verification': EmailVerification;
	}
}
@customElement('drk-email-verification')
export class EmailVerification extends LitElement {
	@property()
	public props: IEmailVerificationProps;
	public actions: IEmailVerificationActions;

	public static get styles() {
		return [
			mdcElevation,
			mdcTypography,
			mdcTextfield,
			unsafeCSS(commonCss),
			css`
				.body {
					display: grid;
					grid-template-columns: 32px 1fr;
					align-items: center;
					gap: var(--content-spacing);
				}
				.result {
					font-size: 32px;
				}
				.result.success {
					color: limegreen;
				}
				.result.failure {
					color: var(--error-color);
				}
			`,
		];
	}
	async connectedCallback(): Promise<void> {
		super.connectedCallback();
		await this.updateComplete;
		this.props = { ...this.props, isLoading: true };
		this.actions.verify(this.props).then((props) => (this.props = props));
	}
	public render() {
		return form(
			defaultHeader(),
			html`<div class="body">${this.renderResult()}</div>`,
			signUpFooter(this.props, this.actions)
		);
	}

	public renderResult() {
		if (this.props.isLoading)
			return html`
				${svg`${unsafeSVG(oval)}`}
				<div>${msg(`Verification in progress...`)}</div>
			`;
		if (!this.props.success)
			return html`
				<md-icon class="result failure">cancel</md-icon>
				<div>${msg(`Verification failure: ${this.props.lastError}`)}</div>
			`;
		return html`
			<md-icon class="result success">check_circle</md-icon>
			<div>${msg(`Verification success`)}</div>
		`;
	}
}
