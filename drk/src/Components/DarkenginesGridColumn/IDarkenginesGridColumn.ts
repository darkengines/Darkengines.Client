import { ICollectionModel } from '../../Model/ICollectionModel';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IReferenceModel } from '../../Model/IReferenceModel';
import { IDarkenginesGridColumnHeader } from '../DarkenginesGridColumnHeader/IDarkenginesGridColumnHeader';

export default interface IDarkenginesGridColumn {
	type: string;
	name: string;
	header: IDarkenginesGridColumnHeader;
	model: IReferenceModel | ICollectionModel | IPropertyModel;
}
