import '../ArrayExtensions';
import '../Expressions/QueryableExtensions';
import '../StringExtensions';
import Queryable from '../Expressions/Queryable';
import { IEntityModel } from '../Model/IEntityModel';
import { decycle } from '../Serialization/JsonNetDecycle';
import { queryProvider } from './QueryProvider';
import { DeepPartial } from 'ts-essentials';

export class Client {
	public async saveOrUpdate<TEntity extends object>(
		modelName: string,
		entity: DeepPartial<TEntity>
	): Promise<TEntity>;
	public async saveOrUpdate<TEntity extends object>(
		model: IEntityModel,
		entity: DeepPartial<TEntity>
	): Promise<TEntity>;
	public async saveOrUpdate<TEntity extends object>(
		model: IEntityModel | string,
		entity: DeepPartial<TEntity>
	): Promise<TEntity> {
		const modelName = typeof model == 'string' ? model : model.name;
		const queryString = `${modelName}.SaveOrUpdate(${JSON.stringify(decycle(entity))})`;
		const query = queryProvider.queryAuthenticated<TEntity>(queryString);
		return await query.execute();
	}
	public query<TEntity>(string: IEntityModel): Queryable<TEntity[]>;
	public query<TEntity>(model: IEntityModel): Queryable<TEntity[]>;
	public query<TEntity>(model: IEntityModel | string): Queryable<TEntity[]> {
		const modelName = typeof model == 'string' ? model : model.name;
		const queryString = `${modelName}.Query`;
		const query = queryProvider.queryAuthenticated<TEntity[]>(queryString);
		return query;
	}
}

const apiClient = new Client();

export { apiClient };
