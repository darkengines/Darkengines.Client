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
import { apiClient } from '@drk/src/Api/Client';
import { IUser, UserModelName } from '../Models/IUser';
import Schema from '@drk/src/Model/Schema';

export interface ISignupRoute {
	handler: (_: Routing.IRouteContext) => any;
}

export interface ISignupRouteState {}

@injectable()
export class SignupRoute implements IRoute, ISignupRoute {
	protected schema: Schema;
	public constructor(@inject(Schema) schema: Schema) {
		this.schema = schema;
	}
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
			signUp: async (props) => {
				const result = await apiClient.saveOrUpdate<IUser>(UserModelName, {
					userEmailAddresses: [{ emailAddress: props.emailAddress }],
					password: props.password,
				});
				return props;
			},
		};
		return html`<drk-signup .props=${props} .actions=${actions}></drk-signup>`;
	}
}
