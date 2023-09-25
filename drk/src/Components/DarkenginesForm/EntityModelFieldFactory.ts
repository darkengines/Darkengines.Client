import { injectable } from 'inversify';
import { flatten } from 'lodash';
import { IEntityModel } from '../../Model/IEntityModel';
import FieldFactory from './FieldFactory';
import { IFieldFactoryContext } from './IFieldFactory';

@injectable()
export class EntityModelFieldFactory extends FieldFactory<IEntityModel> {
	canHandle(model: IEntityModel) {
		return model.modelType == 'EntityModel';
	}
	async createFields(context: IFieldFactoryContext, model: IEntityModel) {
		const properties = model.properties.filter(
			(property) =>
				!model.references.some((reference) =>
					reference.foreignKey.some((fkProperty) => fkProperty == property)
				) && !model.primaryKey.some((pkProperty) => pkProperty == property)
		);
		const members = [...properties, ...model.references, ...model.collections];
		const fieldFactoryResults = await Promise.all(
			members
				.map((member) => {
					const result = context.fieldFactories
						.find((fieldFactory) => fieldFactory.canHandle(member))
						?.createFields(context, member);
					return result;
				})
				.filter((result) => result !== undefined)
		);
		const fields = flatten(
			fieldFactoryResults.map((fieldFactoryResult) => fieldFactoryResult.fields)
		);
		return {
			fields,
		};
	}
	// createSummaryFields(context: IFieldFactoryContext, model: IEntityModel) {
	// 	const members = getSummaryMembers(model);
	// 	const fieldFactoryResults = members
	// 		.map((member) => {
	// 			const result = context.fieldFactories
	// 				.find((fieldFactory) => fieldFactory.canHandle(member))
	// 				?.createSummaryFields(context, member);
	// 			return result;
	// 		})
	// 		.filter((result) => result !== undefined);
	// 	const fields = flatten(
	// 		fieldFactoryResults.map((fieldFactoryResult) => fieldFactoryResult.fields)
	// 	);
	// 	return {
	// 		fields,
	// 		filter: entityFilter(
	// 			model,
	// 			fieldFactoryResults.map((fieldFactoryResult) => fieldFactoryResult.filter)
	// 		),
	// 	};
	// }
}
