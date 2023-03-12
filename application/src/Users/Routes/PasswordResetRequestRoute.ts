import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/PasswordResetRequest/PasswordResetRequest';
import { msg } from '@lit/localize';
import { Stateful } from '@drk/src/States/Stateful';
import {
	IPasswordResetRequestActions,
	IPasswordResetRequestProps,
} from '../Components/PasswordResetRequest/PasswordResetRequest';
import { runtimeRoot } from 'application/src/Application';

export interface IPasswordResetRequestRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class PasswordResetRequestRoute implements IRoute, IPasswordResetRequestRoute {
	public constructor() {}
	public displayName: any = msg('Password reset request', {
		id: 'passwordResetRequestDisplayName',
	});
	public async handler(_: Routing.IRouteContext) {
		const props: IPasswordResetRequestProps = {
			emailAddress: '',
		};
		const actions: IPasswordResetRequestActions = {
			goToSignIn: (props: IPasswordResetRequestProps) => {
				runtimeRoot.children.anonymous.children.loginRouteNode.execute();
				return props;
			},
		};
		return html`<drk-password-reset-request
			.props=${props}
			.actions=${actions}
		></drk-password-reset-request>`;
	}
}
