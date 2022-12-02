import { Dictionary } from 'lodash';
import { IDarkenginesGridProps } from '../Components/DarkenginesGrid/IDarkenginesGrid';
import { IEntityModel } from '../Model/IEntityModel';

export default interface IGridFactory {
	canHandle(model: IEntityModel): boolean;
	convert(
		model: IEntityModel,
		previous: IDarkenginesGridProps,
		gridFactories: IGridFactory[],
		cache?: Dictionary<IDarkenginesGridProps>
	): IDarkenginesGridProps;
}
