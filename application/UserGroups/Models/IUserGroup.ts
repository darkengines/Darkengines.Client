import { IUserUserGroup } from "./IUserUserGroup";
export interface IUserGroup {
    id: number;
    displayName: string;
    userUserGroups: IUserUserGroup[];
}
