import { IUser } from "./IUser";
export interface IUserPasswordResetRequest {
    userId: number;
    createdById: number;
    createdOn: string;
    guid: unknown;
    modifiedById: number;
    modifiedOn: string;
    createdBy: IUser;
    modifiedBy: IUser;
    user: IUser;
}
export var UserPasswordResetRequestModelName: string = 'UserPasswordResetRequest';
