import { IParameter, ServiceIdentifier } from './IOperator';
import * as estree from 'estree';
import { IComponentFactory } from '../ComponentFactories/IComponentFactory';
import Operator from './IOperator';
import { IBinaryOperator } from './Symbols';

export class BinaryOperator implements Operator<unknown> {
	protected componentFactory: IComponentFactory;
	protected operator: estree.BinaryOperator;
	public parameters: IParameter[];
	public displayName: any;
	public shortDisplayName: any;
	public name: string;
	public identifier: ServiceIdentifier<unknown>;

	constructor(operator: IBinaryOperator) {
		this.operator = operator.operator;
		this.parameters = [
			{
				name: 'value',
				typeName: '*',
				componentFactories: [],
			},
		];
		this.displayName = this.name = this.operator;
		this.identifier = operator.identifier;
		this.shortDisplayName = operator.shortDisplayName;
	}
	canBuildExpression(argument: unknown): boolean {
		return argument !== undefined;
	}

	buildExpression(parameter: estree.Expression, args: any) {
		//args = JSON.stringify(args);
		const binaryExpression: estree.BinaryExpression = {
			type: 'BinaryExpression',
			operator: this.operator,
			left: parameter,
			right: { type: 'Literal', value: args },
		};
		return binaryExpression;
	}
}
