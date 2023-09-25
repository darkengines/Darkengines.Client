import { IUserUserGroup } from "./IUserUserGroup";
export interface IUserGroup {
    id: number;
    displayName: string;
    userUserGroups: IUserUserGroup[];
}
export var UserGroupModelName: string = 'UserGroup';
