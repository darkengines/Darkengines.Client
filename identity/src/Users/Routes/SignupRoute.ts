import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Signup/Signup';
import { msg } from '@lit/localize';
import { Stateful } from '@drk/src/States/Stateful';
import { runtimeRoot } from '../../Application';
import { ISignup, ISignupActions, ISignupProps } from '../Components/Signup/Signup';
import { authentication } from '@drk/src/Authentication/Authentication';

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
				runtimeRoot.children.loginRouteNode.execute();
				return props;
			},
			async signUp(props) {
				try {
					const result = await authentication.actions.create(
						props.login,
						props.emailAddress,
						props.password
					);
				} catch (exception) {
					props = { ...props, lastError: exception };
				}
				props = { ...props, loading: false };
				return props;
			},
		};
		return html`<drk-signup .props=${props} .actions=${actions}></drk-signup>`;
	}
}
