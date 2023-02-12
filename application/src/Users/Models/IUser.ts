import { IUserProfile } from "./IUserProfile";
import { IUserSettings } from "./IUserSettings";
import { IUserEmailAddress } from "./IUserEmailAddress";
import { IUserPasswordResetRequest } from "../../Authentication/Models/IUserPasswordResetRequest";
import { IUserUserGroup } from "../../UserGroups/Models/IUserUserGroup";
export interface IUser {
    id: number;
    createdById: number;
    createdOn: string;
    deactivatedByUserId: number;
    deactivatedOn: string;
    hashedPassword: string;
    isActive: boolean;
    lastIpAddress: string;
    modifiedById: number;
    modifiedOn: string;
    createdBy: IUser;
    deactivatedByUser: IUser;
    modifiedBy: IUser;
    userProfile: IUserProfile;
    userSettings: IUserSettings;
    userEmailAddresses: IUserEmailAddress[];
    userPasswordResetRequests: IUserPasswordResetRequest[];
    userUserGroups: IUserUserGroup[];
}
export var UserModelName: string = 'User';
