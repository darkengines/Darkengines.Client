import { IUserApplication } from "./IUserApplication";
export interface IApplication {
    id: number;
    displayName: string;
    name: string;
    userApplications: IUserApplication[];
}
export var ApplicationModelName: string = 'Application';
