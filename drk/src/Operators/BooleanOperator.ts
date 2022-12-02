import { injectable, inject } from 'inversify';
import Operator, { IParameter } from './IOperator';
import * as estree from 'estree';
import { BooleanComponentFactory } from '../ComponentFactories/BooleanComponentFactory/BooleanComponentFactory';

@injectable()
export class BooleanOperator extends Operator<boolean> {
	protected booleanComponentFactory: BooleanComponentFactory;
	public parameters: IParameter[];
	constructor(@inject(BooleanComponentFactory) booleanComponentFactory: BooleanComponentFactory) {
		super();
		this.booleanComponentFactory = booleanComponentFactory;
		this.parameters = [
			{
				name: 'value',
				typeName: 'Boolean',
				componentFactories: [booleanComponentFactory],
			},
		];
	}
	name = BooleanOperator.name;
	displayName = 'Value';
	buildExpression(parameter: estree.Expression, args: boolean) {
		if (args === undefined) return undefined;
		if (!args)
			return {
				type: 'UnaryExpression',
				operator: '!',
				argument: parameter,
			} as estree.UnaryExpression;
		return parameter;
	}
}
