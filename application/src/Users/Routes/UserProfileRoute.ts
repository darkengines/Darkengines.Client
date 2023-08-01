import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Login/Login';
import { msg } from '@lit/localize';
import '../Components/UserProfile/UserProfile';

export interface IUserProfileRouteState {}

export interface IUserProfileRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class UserProfileRoute implements IRoute, IUserProfileRoute {
	public constructor() {}
	public displayName: any = msg('UserProfile', { id: 'userProfileDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const initialState: IUserProfileRouteState = {};
		return html`<drk-user-profile></drk-user-profile>`;
	}
}
