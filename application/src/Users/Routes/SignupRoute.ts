import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Signup/Signup';
import { msg } from '@lit/localize';
import { Stateful } from '@drk/src/States/Stateful';
import { runtimeRoot } from 'application/src/Application';
import { ISignup, ISignupActions, ISignupProps } from '../Components/Signup/Signup';

export interface ISignupRoute {
	handler: (_: Routing.IRouteContext) => any;
}

export interface ISignupRouteState {}

@injectable()
export class SignupRoute implements IRoute, ISignupRoute {
	public constructor() {}
	public displayName: any = msg('Sign up', { id: 'signupDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const props: ISignupProps = {
			emailAddress: '',
			login: '',
			gcuAgreement: false,
			loading: false,
			password: '',
			passwordConfirmation: '',
			lastError: undefined,
		};
		const actions: ISignupActions = {
			goToGcu(props) {
				throw 'Not implemented';
			},
			goToSignIn(props) {
				runtimeRoot.children.anonymous.children.loginRouteNode.execute();
				return props;
			},
			signUp(props) {
				throw 'Not implemented';
			},
		};
		return html`<drk-signup .props=${props} .actions=${actions}></drk-signup>`;
	}
}
