import { injectable, inject } from 'inversify';
import { StringComponentFactory }from '../ComponentFactories/StringComponentFactory/StringComponentFactory';
import Operator, { IParameter } from './IOperator';
import * as estree from 'estree';

@injectable()
export class ContainsOperator extends Operator<string> {
	protected stringComponentFactory: StringComponentFactory;
	public parameters: IParameter[];
	constructor(@inject(StringComponentFactory) stringComponentFactory: StringComponentFactory) {
		super();
		this.stringComponentFactory = stringComponentFactory;
		this.parameters = [
			{
				name: 'value',
				typeName: 'String',
				componentFactories: [stringComponentFactory],
			},
		];
	}
	name = ContainsOperator.name;
	displayName = 'Contains';
	buildExpression(parameter: estree.Expression, args: string) {
		if (!args || !args.length) return undefined;
		const callExpression: estree.CallExpression = {
			optional: false,
			type: 'CallExpression',
			arguments: [{ type: 'Literal', value: `%${args}%` }],
			callee: {
				object: parameter,
				type: 'MemberExpression',
				property: { type: 'Identifier', name: 'like' },
			} as estree.MemberExpression,
		};
		return callExpression;
	}
}
