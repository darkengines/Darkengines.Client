import { injectable } from 'inversify';
import Queryable from '../Expressions/Queryable';
import { Expression } from 'estree';
import { authenticatedQueryExecutor, queryExecutor } from './QueryExecutor';

@injectable()
export default class QueryProvider {
	public query<T>(expression: Expression | string): Queryable<T> {
		return new Queryable(expression, queryExecutor);
	}
	public queryAuthenticated<T>(expression: Expression | string): Queryable<T> {
		return new Queryable(expression, authenticatedQueryExecutor);
	}
}

const queryProvider = new QueryProvider();

function rawQuery<TResult>(strings: TemplateStringsArray, ...expressions: any[]): string {
	let queryString = '';

	for (let i = 0; i < expressions.length; i++) {
		queryString += strings[i];
		const expression = expressions[i];

		if (typeof expression === 'object') {
			queryString += JSON.stringify(expression);
		} else {
			queryString += `'${expression}'`;
		}
	}

	queryString += strings[strings.length - 1];
	return queryString;
}

export { queryProvider, rawQuery };
