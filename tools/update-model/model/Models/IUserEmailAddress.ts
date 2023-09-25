import { IUser } from "./IUser";
export interface IUserEmailAddress {
    hashedEmailAddress: string;
    createdById: number;
    createdOn: string;
    emailAddress: string;
    guid: unknown;
    guidExpirationDate: string;
    isVerified: boolean;
    modifiedById: number;
    modifiedOn: string;
    userId: number;
    createdBy: IUser;
    modifiedBy: IUser;
    user: IUser;
}
export var UserEmailAddressModelName: string = 'UserEmailAddress';
