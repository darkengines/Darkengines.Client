import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '../Components/Login/Login';
import { msg } from '@lit/localize';
import '../Components/UserProfile/UserProfile';
import '../../index.css';
import { IUserProfileProps, UserProfile } from '../Components/UserProfile/UserProfile';
import { apiClient } from '@drk/src/Api/Client';
import { authentication } from '@drk/src/Authentication/Authentication';
import { IUserProfile } from '../Models/IUserProfile';
import { lambda } from '@drk/src/Expressions/LambdaExpression';
import { delta } from '@drk/src/store';
import Schema from '@drk/src/Model/Schema';
import { inject } from 'inversify';

export interface IUserProfileRouteState {}

export interface IUserProfileRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class UserProfileRoute implements IRoute, IUserProfileRoute {
	protected schema: Schema;
	public constructor(@inject(Schema) schema: Schema) {
		this.schema = schema;
	}

	public displayName: any = msg('UserProfile', { id: 'userProfileDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const currentUserId = authentication.state.identity.id;
		const userProfile = (
			await apiClient
				.query<IUserProfile>(UserProfile.name)
				.where(
					lambda(
						{
							currentUserId,
						},
						(context) => (userProfile) => userProfile.id == context.scope.currentUserId
					)
				)
				.execute()
		)[0];
		const initialProps: IUserProfileProps = {
			userProfile,
		};
		return html`<drk-user-profile
			.props=${initialProps}
			.save=${(props: IUserProfileProps) => this.save(initialProps.userProfile, props)}
		></drk-user-profile>`;
	}
	protected async save(
		initial: IUserProfile,
		userProfileProps: IUserProfileProps
	): Promise<IUserProfileProps> {
		const model = (await this.schema.model)[UserProfile.name];
		const diff = delta<IUserProfile>(undefined, initial, userProfileProps.userProfile, model);
		if (diff.hasChanged) {
			try {
				await apiClient.saveOrUpdate(UserProfile.name, diff.diff);
			} catch (exception) {
				return { ...userProfileProps, error: exception.Message };
			}
		}
		return userProfileProps;
	}
}
