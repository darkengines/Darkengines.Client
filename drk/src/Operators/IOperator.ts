import * as estree from 'estree';
import { injectable } from 'inversify';
import { Newable } from 'ts-essentials';
import { IComponentFactory } from '../ComponentFactories/IComponentFactory';

interface Abstract<T> {
	prototype: T;
}
export type ServiceIdentifier<T> = string | symbol | Newable<T> | Abstract<T>;

export interface IParameter {
	name: string;
	typeName: string;
	componentFactories: IComponentFactory[];
}

export interface IOperator {
	get name(): string;
	get displayName(): any;
	get shortDisplayName(): any;
	canBuildExpression(...args): boolean;
	buildExpression(parameter: estree.Expression, ...args): estree.Expression;
	get parameters(): IParameter[];
	identifier: ServiceIdentifier<unknown>;
}

@injectable()
export default abstract class Operator<TParameter> implements IOperator {
	canBuildExpression(argument: TParameter): boolean {
		return argument !== undefined;
	}
	public abstract get name(): string;
	public abstract get displayName(): any;
	public get shortDisplayName(): any {
		return this.displayName;
	}
	public abstract get parameters(): IParameter[];
	public get identifier(): ServiceIdentifier<unknown> {
		return this.constructor;
	}
	public abstract buildExpression(
		parameter: estree.Expression,
		argument: TParameter
	): estree.Expression;
}

export type OperatorExpressionBuilder<TParameter> = (
	parameter: estree.Expression,
	argument: TParameter
) => estree.Expression;

export class CustomOperator<TParameter> extends Operator<TParameter> {
	public name: string;
	public displayName: any;
	public constructor(buildExpression: OperatorExpressionBuilder<TParameter>) {
		super();
		this.buildExpression = buildExpression;
	}
	public get shortDisplayName(): any {
		return this.displayName;
	}
	public parameters: IParameter[];
	public get identifier(): ServiceIdentifier<unknown> {
		return this.constructor;
	}
	public buildExpression: OperatorExpressionBuilder<TParameter>;
}
