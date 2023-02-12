import { IUser } from "../../Users/Models/IUser";
import { IUserGroup } from "./IUserGroup";
export interface IUserUserGroup {
    userId: number;
    userGroupId: number;
    index: number;
    user: IUser;
    userGroup: IUserGroup;
}
export var UserUserGroupModelName: string = 'UserUserGroup';
