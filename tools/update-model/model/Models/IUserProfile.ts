import { IUser } from "./IUser";
export interface IUserProfile {
    id: number;
    createdById: number;
    createdOn: string;
    displayName: string;
    firstname: string;
    gender: unknown;
    imageUrl: string;
    lastname: string;
    modifiedById: number;
    modifiedOn: string;
    createdBy: IUser;
    modifiedBy: IUser;
    user: IUser;
}
export var UserProfileModelName: string = 'UserProfile';
