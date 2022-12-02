import { injectable } from 'inversify';
import { IPropertyModel } from '../../Model/IPropertyModel';
import FieldFactory from './FieldFactory';
import { IFormField } from '../Forms';
import { IFieldFactoryContext } from './IFieldFactory';
import { propertyFilter } from '../../Filters/filters';

@injectable()
export default class PropertyFieldFactory extends FieldFactory<IPropertyModel> {
	canHandle(model: IPropertyModel) {
		return model.modelType == 'PropertyModel';
	}
	async createFields(context: IFieldFactoryContext, property: IPropertyModel) {
		const field: IFormField = {
			name: property.name,
			model: property,
			displayName: property.displayName,
			getComponentProps: (formProps) => ({
				component: undefined,
				model: property,
				value: formProps.value?.[property.name],
			}),
			getComponentActions: (formProps, formActions) => ({
				valueChanged: (props) =>
					formActions.valueChanged({
						...formProps,
						value: {
							...formProps.value,
							[property.name]: props.value,
						}
					}),
			}),
			componentFactory: property.componentFactories[0],
		};
		const fields = [field];
		return {
			fields,
		};
	}
	createSummaryFields(context: IFieldFactoryContext, property: IPropertyModel) {
		return { ...this.createFields(context, property), filter: propertyFilter(property) };
	}
}
