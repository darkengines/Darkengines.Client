import { injectable } from 'inversify';
import Queryable from '../Expressions/Queryable';
import { Expression } from 'estree';
import { authenticatedQueryExecutor, queryExecutor } from './QueryExecutor';

@injectable()
export default class QueryProvider {
	public query<T>(expression: Expression | string): Queryable<T> {
		console.log('query');
		return new Queryable(expression, queryExecutor);
	}
	public queryAuthenticated<T>(expression: Expression | string): Queryable<T> {
		return new Queryable(expression, authenticatedQueryExecutor);
	}
}

const queryProvider = new QueryProvider();

export { queryProvider };
