import { IUser } from "./IUser";
export interface IUserProfile {
    id: number;
    createdById: number;
    createdOn: string;
    displayName: string;
    firstname: string;
    gender: unknown;
    lastname: string;
    modifiedById: number;
    modifiedOn: string;
    createdBy: IUser;
    modifiedBy: IUser;
    user: IUser;
}
