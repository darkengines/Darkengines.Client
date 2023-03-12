import { IDarkenginesGridProps } from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { IEntityModel } from '../Model/IEntityModel';

export interface IDarkenginesAdminProps {
	models: IEntityModel[];
	selectedModel: IEntityModel;
	darkenginesGrid: Promise<IDarkenginesGridProps>;
	deleteItem?: unknown;
}
