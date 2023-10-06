import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import commonCss from '!raw-loader!../../../Common/Common.css';
import { IUserProfile } from '../../Models/IUserProfile';
import { OutlinedTextField } from '@material/web/textfield/internal/outlined-text-field';

declare global {
	interface HTMLElementTagNameMap {
		'drk-user-profile': UserProfile;
	}
}

export interface IUserProfileProps {
	userProfile: IUserProfile;
	error?: string;
}

@customElement('drk-user-profile')
export class UserProfile extends LitElement {
	@property({ type: Object })
	public props: IUserProfileProps;
	public save: (userProfileProps: IUserProfileProps) => Promise<IUserProfileProps>;
	public static get styles() {
		return [unsafeCSS(commonCss)];
	}
	@query('#displayName')
	protected displayNameInput: OutlinedTextField;
	@query('#firstName')
	protected firstNameInput: OutlinedTextField;
	@query('#lastName')
	protected lastNameInput: OutlinedTextField;
	@query('#gender')
	protected genderInput: OutlinedTextField;

	render() {
		return html`
			<div class="form">
				<h2>Profile</h2>
				<drk-textfield
					id="displayName"
					label="Display name"
					value=${this.props.userProfile.displayName}
				></drk-textfield>
				<drk-textfield
					id="firstName"
					label="First name"
					value=${this.props.userProfile.firstname}
					padding
				></drk-textfield>
				<drk-textfield
					id="lastName"
					label="Last name"
					value=${this.props.userProfile.lastname}
					padding
				></drk-textfield>
				<md-outlined-select id="gender" label="Gender">
					<md-select-option value="Male" headline="Male"></md-select-option>
					<md-select-option value="Female" headline="Female"></md-select-option>
					<md-select-option value="Unknown" headline="Unknown"></md-select-option>
				</md-outlined-select>
				<div class="action-report">
					<div class="report error">${this.props.error}</div>
					<md-outlined-button
						class="submit"
						@click=${async (e: MouseEvent) =>
							(this.props = await this.save({
								...this.props,
								userProfile: {
									...this.props.userProfile,
									displayName: this.displayNameInput.value,
									firstname: this.firstNameInput.value,
									lastname: this.lastNameInput.value,
									gender: this.genderInput.value,
								},
							}))}
						>Save</md-outlined-button
					>
				</div>
			</div>
		`;
	}
}
