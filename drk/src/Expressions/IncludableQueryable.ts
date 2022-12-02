import { Expression } from 'estree';
import { IQueryExecutor } from '../Api/QueryExecutor';
import Queryable from './Queryable';

export default class IncludableQueryable<TEntity, TPreviousInclude> extends Queryable<TEntity> {
	public constructor(
		expression: Expression | string,
		executor: IQueryExecutor,
		action: (item: TEntity) => Promise<TEntity>
	) {
		super(expression, executor, action);
	}
}
