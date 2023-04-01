import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/EmailVerification/EmailVerification';
import { Stateful } from '@drk/src/States/Stateful';
import { runtimeRoot } from 'application/src/Application';
import {
	IEmailVerificationActions,
	IEmailVerificationProps,
	EmailVerification,
} from '../Components/EmailVerification/EmailVerification';
import { ref } from 'lit/directives/ref.js';
import { apiClient } from '@drk/src/Api/Client';
import '../Extensions';
import { authentication } from '@drk/src/Authentication/Authentication';

export interface IEmailVerificationRouteState {}

export interface IEmailVerificationRoute {
	handler: (_: Routing.IRouteContext, guid: string) => any;
}

@injectable()
export class EmailVerificationRoute implements IRoute, IEmailVerificationRoute {
	public constructor() {}
	public async handler(_: Routing.IRouteContext, guid: string) {
		const initialState: IEmailVerificationRouteState = {};
		const props: IEmailVerificationProps = {
			guid,
			isLoading: false,
			lastError: undefined,
			success: false,
		};
		let emailVerification: EmailVerification;
		const actions: IEmailVerificationActions = {
			onVerificationSuccess: (props: IEmailVerificationProps) => {
				return props;
			},
			goToSignup: (props: IEmailVerificationProps) => {
				runtimeRoot.children.anonymous.children.signupRouteNode.execute();
				return props;
			},
			async verify(props: IEmailVerificationProps): Promise<IEmailVerificationProps> {
				try {
					const result = await authentication.actions.verify(props.guid);
					props = { ...props, success: true, lastError: undefined };
				} catch (exception) {
					props = { ...props, lastError: exception.message };
				} finally {
					props = { ...props, isLoading: false };
				}
				return props;
			},
		};
		const state = Stateful.create(initialState, {});
		return html`<drk-email-verification
			${ref((part: EmailVerification) => {
				if (part) {
					emailVerification = part;
				}
			})}
			.props=${props}
			.actions=${actions}
		></drk-email-verification>`;
	}
}
