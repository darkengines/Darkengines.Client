import * as estree from 'estree';
import Operator from './IOperator';
import { INavigation } from '../Model/INavigation';

export default class ReferenceOperator<TParameter> extends Operator<TParameter> {
	public static fromOperator<TParameter>(
		navigation: INavigation,
		underlyingOperator: Operator<TParameter>
	) {
		return new ReferenceOperator<TParameter>(navigation, underlyingOperator);
	}
	protected navigation: INavigation;
	protected underlyingOperator: Operator<TParameter>;
	public constructor(navigation: INavigation, underlyingOperator: Operator<TParameter>) {
		super();
		this.navigation = navigation;
		this.underlyingOperator = underlyingOperator;
	}
	canBuildExpression(argument: TParameter): boolean {
		return this.underlyingOperator.canBuildExpression(argument);
	}
	public get name() {
		return this.underlyingOperator.name;
	}
	public get displayName() {
		return this.underlyingOperator.displayName;
	}
	public get shortDisplayName(): any {
		return this.displayName;
	}
	public get parameters() {
		return this.underlyingOperator.parameters;
	}
	public buildExpression(parameter: estree.Expression, argument: TParameter): estree.Expression {
		const identifierExpression: estree.Identifier = {
			name: this.navigation.name,
			type: 'Identifier',
		};
		const memberAccessExpression: estree.MemberExpression = {
			computed: false,
			object: parameter,
			optional: false,
			property: identifierExpression,
			type: 'MemberExpression',
		};
		return this.underlyingOperator.buildExpression(memberAccessExpression, argument);
	}
}
