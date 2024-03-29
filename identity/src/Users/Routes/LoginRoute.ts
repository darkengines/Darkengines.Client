import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Login/Login';
import { msg } from '@lit/localize';
import { Stateful } from '@drk/src/States/Stateful';
import { runtimeRoot } from '../../Application';
import { ILoginActions, ILoginProps, Login } from '../Components/Login/Login';
import { ref } from 'lit/directives/ref.js';
import { apiClient, rawQuery } from '@drk/src/Api/Client';

export interface ILoginRouteState {}

export interface ILoginRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class LoginRoute implements IRoute, ILoginRoute {
	public constructor() {}
	public displayName: any = msg('Login', { id: 'loginDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const initialState: ILoginRouteState = {};
		const props: ILoginProps = {
			login: '',
			password: '',
			isLoading: false,
		};
		let login: Login;
		const actions: ILoginActions = {
			goToPasswordResetRequest: (props: ILoginProps) => {
				runtimeRoot.children.passwordResetRequestRouteNode.execute();
				return props;
			},
			signIn: async (props: ILoginProps) => {
				const query = apiClient.rawQuery<string>(
					rawQuery`login(${props.login}, ${props.password})`
				);
				console.log(query.code);
				const result = await query.execute();
				console.log(`Login(${props.login}, ${props.password})`);
				await new Promise((resolve, reject) => setTimeout(resolve, 1000));
				//apiClient.saveOrUpdate();
				props = { ...props, isLoading: false };
				return props;
			},
			goToSignup: (props: ILoginProps) => {
				runtimeRoot.children.signupRouteNode.execute();
				return props;
			},
		};
		const state = Stateful.create(initialState, {});
		return html`<drk-login
			${ref((part: Login) => {
				if (part) {
					login = part;
				}
			})}
			.props=${props}
			.actions=${actions}
		></drk-login>`;
	}
}
