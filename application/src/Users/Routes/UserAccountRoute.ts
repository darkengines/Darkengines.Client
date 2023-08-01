import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Login/Login';
import { msg } from '@lit/localize';
import '../Components/UserAccount/UserAccount';

export interface IUserAccountRouteState {}

export interface IUserAccountRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class UserAccountRoute implements IRoute, IUserAccountRoute {
	public constructor() {}
	public displayName: any = msg('UserAccount', { id: 'userAccountDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const initialState: IUserAccountRouteState = {};
		return html`<drk-user-account></drk-user-account>`;
	}
}
