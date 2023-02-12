import { IApplication } from "./IApplication";
import { IUser } from "../../Users/Models/IUser";
export interface IUserApplication {
    applicationId: number;
    userId: number;
    application: IApplication;
    user: IUser;
}
export var UserApplicationModelName: string = 'UserApplication';
