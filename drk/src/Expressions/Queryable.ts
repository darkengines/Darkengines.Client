import {
	Expression,
	CallExpression,
	ExpressionStatement,
	ObjectExpression,
	Identifier,
	MemberExpression,
	SimpleLiteral,
} from 'estree';
import { parseScript, Syntax, parseModule } from 'esprima';
import { generate } from 'escodegen';
import { ScopedLambda } from './LambdaExpression';
import IQueryable, { IQueryExecutionResult } from './IQueryable';
import { decycle } from '../Serialization/JsonNetDecycle';
import { IQueryExecutor } from '../Api/QueryExecutor';

export interface ILoadingState {
	isLoading: boolean;
}

export default class Queryable<T> implements IQueryable<T> {
	public expression: Expression;
	public executor: IQueryExecutor;
	public action: (result: any) => Promise<any>;
	public constructor(
		expression: Expression | string,
		executor: IQueryExecutor,
		action?: (result: any) => Promise<any>
	) {
		this.executor = executor;
		this.action = action;
		if (typeof expression === 'string') {
			this.expression = (parseScript(expression).body[0] as ExpressionStatement).expression;
		} else {
			this.expression = expression;
		}
	}
	public async executeMonitored(options: any): Promise<IQueryExecutionResult<T>> {
		const startedOn = Date.now();
		const value = await this.execute(options);
		const duration = Date.now() - startedOn;
		return {
			value,
			report: {
				duration,
			},
		};
	}
	public get code(): string {
		return generate(this.expression, { format: { escapeless: true } });
	}
	public set code(expression: string) {
		this.expression = this.expression = (
			parseScript(expression).body[0] as ExpressionStatement
		).expression;
	}
	public static methodCallExpression(
		instance: Expression,
		name: string,
		...params: any[]
	): CallExpression {
		const argumentExpressions = params
			.filter((param) => param !== undefined)
			.map((param) => {
				if (param instanceof ScopedLambda)
					return (parseScript(param.lambdaSource).body[0] as ExpressionStatement)
						.expression;
				else if (param instanceof Object) {
					if (typeof param === 'function') {
						return (parseScript(param.toString()).body[0] as ExpressionStatement)
							.expression;
					}
					const json = JSON.stringify(decycle(param));
					const ast = (parseModule(`(${json})`).body[0] as ExpressionStatement)
						.expression as ObjectExpression;
					return ast;
				} else {
					return {
						type: 'Literal',
						value: JSON.stringify(param),
						raw: param,
					} as SimpleLiteral;
				}
			});
		const memberIdentifier: Identifier = {
			name: name,
			type: Syntax.Identifier,
		};
		const memberExpression: MemberExpression = {
			property: memberIdentifier,
			object: instance,
			type: Syntax.MemberExpression,
			computed: false,
			optional: false,
		};
		const callExpression: CallExpression = {
			callee: memberExpression,
			arguments: argumentExpressions,
			type: Syntax.CallExpression,
		};
		return callExpression;
	}

	public async execute(hasResult: boolean = true, loadingState?: ILoadingState): Promise<T> {
		if (loadingState) loadingState.isLoading = true;
		let result = await this.executor.executeQuery<T>(this, hasResult);
		if (loadingState) loadingState.isLoading = false;
		return (this.action && (await this.action(result))) || result;
	}
}
