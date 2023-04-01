import { IDarkenginesGridProps } from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { IEntityModel } from '../Model/IEntityModel';

export interface IDarkenginesAdminProps {
	models: IEntityModel[];
	model: IEntityModel;
	darkenginesGrid: Promise<IDarkenginesGridProps>;
	deleteItem?: unknown;
}
