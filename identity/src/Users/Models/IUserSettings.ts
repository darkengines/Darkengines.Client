import { IUser } from "./IUser";
export interface IUserSettings {
    id: number;
    createdById: number;
    createdOn: string;
    modifiedById: number;
    modifiedOn: string;
    createdBy: IUser;
    modifiedBy: IUser;
    user: IUser;
}
export var UserSettingsModelName: string = 'UserSettings';
