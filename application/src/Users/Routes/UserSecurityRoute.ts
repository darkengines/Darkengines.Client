import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Login/Login';
import { msg } from '@lit/localize';
import '../Components/UserSecurity/UserSecurity';

export interface IUserSecurityRouteState {}

export interface IUserSecurityRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class UserSecurityRoute implements IRoute, IUserSecurityRoute {
	public constructor() {}
	public displayName: any = msg('UserSecurity', { id: 'userSecurityDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const initialState: IUserSecurityRouteState = {};
		return html`<drk-user-security></drk-user-security>`;
	}
}
