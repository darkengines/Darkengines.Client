import { Dictionary } from 'ts-essentials';
import { inject, injectable, multiInject } from 'inversify';
import DefaultModelCustomizer from './DefaultModelCustomizer';
import { IEntityModel } from './IEntityModel';
import { queryProvider } from '../Api/QueryProvider';
import { authentication } from '../Authentication/Authentication';
import { IModelCustomizer } from './IModelCustomizer';
import { interfaces } from './Interfaces';
import { schemaSample } from '../schema_sample';

@injectable()
export default class Schema {
	protected modelCustomizers: IModelCustomizer[];
	protected defaultModelCustomizer: DefaultModelCustomizer;
	protected resolveModel: (model: Dictionary<IEntityModel>) => void;
	public readonly model: Promise<Dictionary<IEntityModel>>;
	public constructor(
		@multiInject(interfaces.IModelCustomizer) modelCustomizers: IModelCustomizer[],
		@inject(DefaultModelCustomizer) defaultModelCustomizer: DefaultModelCustomizer
	) {
		this.defaultModelCustomizer = defaultModelCustomizer;
		this.modelCustomizers = modelCustomizers.filter(
			(modelCustomizer) => modelCustomizer !== defaultModelCustomizer
		);
		this.model = this.fetchModel();
		// this.model = authentication.state.identity
		// 	? this.fetchModel()
		// 	: new Promise<Dictionary<IEntityModel>>((resolve, reject) => {
		// 			this.resolveModel = resolve;
		// 	  });
		authentication.stateChanged.subscribe(async (sender, args, ev) => {
			if (args.state.identity && this.resolveModel) {
				this.resolveModel(await this.fetchModel());
				ev.unsub();
			}
		});
	}
	protected async fetchModel() {
		const query = await queryProvider.query<IEntityModel[]>('ModelProvider.EntityModels');
		const models = await query.execute();
		//const models = schemaSample;

		let model = models.toDictionary(
			(model) => model.name,
			(model) => {
				model = this.defaultModelCustomizer.customize(model);
				return this.modelCustomizers
					.filter((modelCustomizer) => modelCustomizer.canHandle(model))
					.reduce((model, customizer) => customizer.customize(model), model);
			}
		);
		return model;
	}
}
