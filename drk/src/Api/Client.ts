import '../ArrayExtensions';
import '../Expressions/QueryableExtensions';
import '../StringExtensions';
import Queryable from '../Expressions/Queryable';
import { IEntityModel } from '../Model/IEntityModel';
import { decycle } from '../Serialization/JsonNetDecycle';
import { queryProvider } from './QueryProvider';

export class Client {
	public async saveOrUpdate<TEntity extends object>(
		model: IEntityModel,
		entity: TEntity
	): Promise<TEntity> {
		const queryString = `${model.name}.SaveOrUpdate(${JSON.stringify(decycle(entity))})`;
		const query = queryProvider.queryAuthenticated<TEntity>(queryString);
		return await query.execute();
	}
	public query<TEntity>(model: IEntityModel): Queryable<TEntity[]> {
		const queryString = `${model.name}.Query`;
		const query = queryProvider.queryAuthenticated<TEntity[]>(queryString);
		return query;
	}
}

const apiClient = new Client();

export { apiClient };
