import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { queryProvider } from '@drk/src/Api/QueryProvider';

export async function main() {
	const models = await queryProvider
		.query<IEntityModel[]>('ModelProvider.EntityModels')
		.execute();
	return models;
}
