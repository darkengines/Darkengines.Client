import { injectable } from 'inversify';
import Queryable from '../Expressions/Queryable';
import { retrocycle } from '../Serialization/JsonNetDecycle';
import { getConfig } from './config';
import { authentication } from '../Authentication/Authentication';

export interface IQueryExecutor {
	executeQuery<T>(queryable: Queryable<T>, hasResult?: boolean): Promise<T>;
}

const requestInit: RequestInit = {
	cache: 'no-store',
	method: 'POST',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
};

@injectable()
export class QueryExecutor implements IQueryExecutor {
	protected requestInit = requestInit;
	protected url: Promise<string> = getConfig().then(
		(config) => `${config.schema}://${config.host}:${config.port}/${config.path}`
	);

	public async executeQuery<T>(queryable: Queryable<T>, hasResult?: boolean): Promise<T> {
		let response = await fetch(await this.url, { ...this.requestInit, body: queryable.code });
		if (!response.ok) {
			const responseText = await response.text();
			var exception = JSON.parse(responseText);
			exception.status = response.status;
			throw exception;
		} else if (hasResult) {
			const json = await response.json();
			const data = retrocycle(json);
			return data;
		}
		return undefined;
	}
}

@injectable()
export class AuthenticatedQueryExecutor extends QueryExecutor {
	protected requestInit: RequestInit = {
		...requestInit,
		headers: {
			...requestInit.headers,
			Authorization: `Bearer ${authentication.state.idToken}`,
		},
	};
}

export const queryExecutor = new QueryExecutor();
export const authenticatedQueryExecutor = new AuthenticatedQueryExecutor();
