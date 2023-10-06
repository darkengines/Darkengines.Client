import { LitElement, css, html, unsafeCSS, nothing, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { mdcElevation, mdcTextfield, mdcTypography } from '@drk/src/Styles/Material/index';
import '@drk/src/Components/DarkenginesLightTextfield/DarkenginesLightTextfield';
import '@drk/src/Components/DarkenginesButton/DarkenginesButton';
import { defaultHeader, form, signUpFooter } from '../../../Common/Common';
import commonCss from '!raw-loader!../../../Common/Common.css';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import oval from '@drk/src/Components/DarkenginesButton/oval.svg';

import { msg } from '@lit/localize';
import { IUserEmailAddress } from '../../Models/IUserEmailAddress';
import { repeat } from 'lit/directives/repeat.js';
import { add, getDate, isBefore, parseISO, toDate } from 'date-fns';

export enum UserEmailAddressStatus {
	Never,
	Expired,
	Awaiting,
	Done,
}

export function getUserEmailAddressStatus(userEmailAddress: IUserEmailAddress) {
	if (userEmailAddress.isVerified) return UserEmailAddressStatus.Done;
	if (userEmailAddress.guidExpirationDate === null) return UserEmailAddressStatus.Never;
	const expirationDate = parseISO(userEmailAddress.guidExpirationDate);
	if (isBefore(Date.now(), expirationDate)) return UserEmailAddressStatus.Awaiting;
	return UserEmailAddressStatus.Expired;
}

export function userEmailAddressModel(userEmailAddress: IUserEmailAddress): IUserEmailAddressModel {
	return {
		userEmailAddress,
		status: getUserEmailAddressStatus(userEmailAddress),
		isLoading: false,
	};
}

export interface IUserEmailAddressModel {
	userEmailAddress: IUserEmailAddress;
	status: UserEmailAddressStatus;
	isLoading: boolean;
}

export interface IEmailVerificationRequestProps {
	userEmailAddresses: IUserEmailAddressModel[];
}

export interface IEmailVerificationRequestActions {
	goToSignup: (props: IEmailVerificationRequestProps) => IEmailVerificationRequestProps;
	requestUserEmailAddressVerification: (
		props: IEmailVerificationRequestProps,
		hashedEmailAddress: string
	) => Promise<IEmailVerificationRequestProps>;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-email-verification-request': EmailVerificationRequest;
	}
}
@customElement('drk-email-verification-request')
export class EmailVerificationRequest extends LitElement {
	@property()
	public props: IEmailVerificationRequestProps;
	public actions: IEmailVerificationRequestActions;

	public static get styles() {
		return [
			mdcElevation,
			mdcTypography,
			mdcTextfield,
			unsafeCSS(commonCss),
			css`
				.body {
				}
				#userEmailAddresses {
					display: grid;
					gap: var(--content-spacing);
					grid-template-columns: auto auto;
					grid-auto-rows: 42px;
					place-items: center start;
					place-content: center start;
					grid-auto-flow: row;
				}
				.emailAddress {
					justify-self: end;
				}
				.status {
					justify-self: start;
				}
				.result {
					font-size: 32px;
				}
				.success {
					color: limegreen;
				}
				.error {
					color: var(--error-color);
				}
				.case {
					display: grid;
					grid-auto-flow: column;
					align-items: center;
					justify-items: start;
					padding: var(---content-padding);
					gap: calc(var(--content-spacing) / 2);
				}
				.awaiting svg {
					width: 16px;
				}
			`,
		];
	}
	async connectedCallback(): Promise<void> {
		super.connectedCallback();
	}
	public render() {
		return form(
			defaultHeader(),
			html`<div class="body">
				<div id="userEmailAddresses">
					${repeat(this.props.userEmailAddresses, (userEmailAddress) => {
						return this.renderUserEmailAddress(userEmailAddress);
					})}
				</div>
			</div>`,
			signUpFooter(this.props, this.actions)
		);
	}

	public renderUserEmailAddress(userEmailAddressModel: IUserEmailAddressModel) {
		return html`
			<div class="emailAddress">${userEmailAddressModel.userEmailAddress.emailAddress}</div>
			<div class="status">${this.renderEmailAddressStatus(userEmailAddressModel)}</div>
		`;
	}
	protected renderEmailAddressStatus(userEmailAddressModel: IUserEmailAddressModel) {
		switch (userEmailAddressModel.status) {
			case UserEmailAddressStatus.Done: {
				return html`<div class="case done">
					<div>${msg(`Verified`)}</div>
					<md-icon class="icon success">check_circle</md-icon>
				</div>`;
			}
			case UserEmailAddressStatus.Awaiting: {
				return html`<div class="case awaiting">
					<div>${msg(`Awaiting`)}</div>
					${svg`${unsafeSVG(oval)}`}
				</div>`;
			}
			case UserEmailAddressStatus.Expired: {
				return html`<div class="case expired">
					<div>${msg(`Expired`)}</div>
					<md-icon class="icon error">cancel</md-icon>
					<drk-button
						hasLoader
						@click=${async (e: MouseEvent) => {
							this.onVerify(userEmailAddressModel);
						}}
						?isLoading=${userEmailAddressModel.isLoading}
						>${msg(`Verify`)}</drk-button
					>
				</div>`;
			}
			case UserEmailAddressStatus.Never: {
				return html`<drk-button
					hasLoader
					@click=${async (e: MouseEvent) => {
						this.onVerify(userEmailAddressModel);
					}}
					?isLoading=${userEmailAddressModel.isLoading}
					>${msg(`Verify`)}</drk-button
				>`;
			}
		}
	}

	async onVerify(userEmailAddressModel: IUserEmailAddressModel) {
		try {
			const userEmailAddresses = this.props.userEmailAddresses.set(
				(userEmailAddress) => userEmailAddress == userEmailAddressModel,
				(userEmailAddress) => ({
					...userEmailAddress,
					lastError: undefined,
					isLoading: true,
				})
			);
			this.props = { ...this.props, userEmailAddresses };
			const props = await this.actions.requestUserEmailAddressVerification(
				this.props,
				userEmailAddressModel.userEmailAddress.hashedEmailAddress
			);
		} catch (exception) {
			const userEmailAddresses = this.props.userEmailAddresses.set(
				(userEmailAddress) => userEmailAddress == userEmailAddressModel,
				(userEmailAddress) => ({
					...userEmailAddress,
					lastError: exception,
					isLoading: false,
				})
			);
			this.props = { ...this.props, userEmailAddresses };
		} finally {
			const userEmailAddresses = this.props.userEmailAddresses.set(
				(userEmailAddress) => userEmailAddress == userEmailAddressModel,
				(userEmailAddress) => ({
					...userEmailAddress,
					isLoading: false,
				})
			);
			this.props = { ...this.props, userEmailAddresses };
		}
	}
}
