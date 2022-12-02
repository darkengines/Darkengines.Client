import { IFilter } from "../DarkenginesGrid/IDarkenginesGrid";
import { IFormField } from "../Forms";

export interface IFieldFactoryResult {
    fields: IFormField[]
}

export interface ISummaryFieldFactoryResult {
    fields: IFormField[],
    filter: IFilter
}