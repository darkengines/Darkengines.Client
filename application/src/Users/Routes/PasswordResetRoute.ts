import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/PasswordReset/PasswordReset';
import { msg } from '@lit/localize';
import { Stateful } from '@drk/src/States/Stateful';
import {
	IPasswordResetActions,
	IPasswordResetProps,
} from '../Components/PasswordReset/PasswordReset';
import { IValidationState } from '@drk/src/Validation/ValidationState';
import { runtimeRoot } from 'application/src/Application';

export interface IPasswordResetRoute {
	handler: (_: Routing.IRouteContext) => any;
}
export interface IPasswordResetRouteState {}

@injectable()
export class PasswordResetRoute implements IRoute, IPasswordResetRoute {
	public constructor() {}
	public displayName: any = msg('Password reset', {
		id: 'passwordResetDisplayName',
	});
	public async handler(_: Routing.IRouteContext) {
		const props: IPasswordResetProps = {
			password: '',
			passwordConfirmation: '',
			lastError: undefined,
			loading: false,
		};
		const actions: IPasswordResetActions = {
			resetPassword: (props: IPasswordResetProps) => {
				throw 'not implemented';
			},
			goToSignup: (props) => {
				runtimeRoot.children.anonymous.children.signupRouteNode.execute();
				return props;
			},
		};
		const validationState: IValidationState<IPasswordResetProps> = {
			password: undefined,
			passwordConfirmation: undefined,
		};
		return html`<drk-password-reset
			.props=${props}
			.actions=${actions}
			.validation-state=${validationState}
		></drk-password-reset>`;
	}
}
