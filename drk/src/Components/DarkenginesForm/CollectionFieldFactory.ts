import { injectable } from 'inversify';
import { collectionFilter } from '../../Filters/filters';
import { ICollectionModel } from '../../Model/ICollectionModel';
import FieldFactory from './FieldFactory';
import { IFieldFactoryContext } from './IFieldFactory';
import { ISummaryFieldFactoryResult } from './IFieldFactoryResult';

@injectable()
export default class CollectionFieldFactory extends FieldFactory<ICollectionModel> {
	canHandle(model: ICollectionModel) {
		return model.modelType == 'CollectionModel';
	}
	async createFields(context: IFieldFactoryContext, model: ICollectionModel) {
		const fields = [];
		return {
			fields,
		};
	}
	createSummaryFields(
		context: IFieldFactoryContext,
		collection: ICollectionModel
	): ISummaryFieldFactoryResult {
		return { fields: [], filter: collectionFilter(collection, []) };
	}
}
