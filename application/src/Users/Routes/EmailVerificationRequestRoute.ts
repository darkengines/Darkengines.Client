import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/EmailVerificationRequest/EmailVerificationRequest';
import { Stateful } from '@drk/src/States/Stateful';
import { runtimeRoot } from 'application/src/Application';
import {
	IEmailVerificationRequestActions,
	IEmailVerificationRequestProps,
	EmailVerificationRequest,
	UserEmailAddressStatus,
	IUserEmailAddressModel,
	userEmailAddressModel,
} from '../Components/EmailVerificationRequest/EmailVerificationRequest';
import { ref } from 'lit/directives/ref.js';
import { apiClient } from '@drk/src/Api/Client';
import '../Extensions';
import { authentication } from '@drk/src/Authentication/Authentication';
import { IUserEmailAddress } from '../Models/IUserEmailAddress';
import { IUser, UserModelName } from '../Models/IUser';
import { lambda } from '@drk/src/Expressions/LambdaExpression';

export interface IEmailVerificationRequestRouteState {}

export interface IEmailVerificationRequestRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class EmailVerificationRequestRoute implements IRoute, IEmailVerificationRequestRoute {
	public constructor() {}
	public async handler(_: Routing.IRouteContext) {
		const initialState: IEmailVerificationRequestRouteState = {};

		const currentUsers = await apiClient
			.query<IUser>(UserModelName)
			.include((user) => user.userEmailAddresses)
			.where(
				lambda(
					{ userId: authentication.state.identity.id },
					(context) => (user) => user.id == context.scope.userId
				)
			)
			.execute();
		const currentUser = currentUsers[0];

		const props: IEmailVerificationRequestProps = {
			userEmailAddresses: currentUser.userEmailAddresses.map(userEmailAddressModel),
		};

		let emailVerification: EmailVerificationRequest;
		const actions: IEmailVerificationRequestActions = {
			goToSignup: (props: IEmailVerificationRequestProps) => {
				runtimeRoot.children.anonymous.children.signupRouteNode.execute();
				return props;
			},
			async requestUserEmailAddressVerification(
				props: IEmailVerificationRequestProps,
				hashedEmailAddress: string
			) {
				await authentication.actions.requestEmailAddressVerification(hashedEmailAddress);
				return props;
			},
		};
		const state = Stateful.create(initialState, {});
		return html`<drk-email-verification-request
			${ref((part: EmailVerificationRequest) => {
				if (part) {
					emailVerification = part;
				}
			})}
			.props=${props}
			.actions=${actions}
		></drk-email-verification-request>`;
	}
}
