import { IUser } from './IUser';
export interface IUserEmailAddress {
	emailAddress: string;
	createdById: number;
	createdOn: string;
	hashedEmailAddress: string;
	isVerified: boolean;
	modifiedById: number;
	modifiedOn: string;
	userId: number;
	createdBy: IUser;
	modifiedBy: IUser;
	user: IUser;
	guidExpirationDate?: string;
}
export var UserEmailAddressModelName: string = 'UserEmailAddress';
