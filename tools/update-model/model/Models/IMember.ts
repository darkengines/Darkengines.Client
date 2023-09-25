import { IEntity } from "./IEntity";
export interface IMember {
    modelName: string;
    entityName: string;
    name: string;
    description: string;
    displayName: string;
    memberType: string;
    entity: IEntity;
}
export var MemberModelName: string = 'Member';
