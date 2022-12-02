import { ContainsOperator } from './ContainsOperator';
import { StartsWithOperator } from './StartsWithOperator';
import * as estree from 'estree';
import { IOperator, ServiceIdentifier } from './IOperator';
import { Dictionary } from 'ts-essentials';
import { BooleanOperator } from './BooleanOperator';

export interface IBinaryOperator {
	displayName: string;
	shortDisplayName: string;
	operator: estree.BinaryOperator;
	identifier: ServiceIdentifier<IOperator>;
}

const binaryOperators: Dictionary<IBinaryOperator, string> = {
	equalsOperator: {
		displayName: 'Equals',
		shortDisplayName: '=',
		operator: '==',
		identifier: Symbol('EqualsOperator'),
	},
	notEqualOperator: {
		displayName: 'Not equal',
		shortDisplayName: '≠',
		operator: '!=',
		identifier: Symbol('NotEqualOperator'),
	},
	lowerThanOperator: {
		displayName: 'Lower than',
		shortDisplayName: '<',
		operator: '<',
		identifier: Symbol('LowerThanOperator'),
	},
	lowerOrEqualOperator: {
		displayName: 'Lower or equal',
		shortDisplayName: '≤',
		operator: '<=',
		identifier: Symbol('LowerOrEqualOperator'),
	},
	greaterThanOperator: {
		displayName: 'Greater than',
		shortDisplayName: '>',
		operator: '>',
		identifier: Symbol('GreaterThanOperator'),
	},
	greaterOrEqualOperator: {
		displayName: 'Greater or equal',
		shortDisplayName: '≥',
		operator: '>=',
		identifier: Symbol('GreaterOrEqualOperator'),
	},
};

export const Operators: {
	IOperator: symbol;
	map: Dictionary<ServiceIdentifier<IOperator>[], string>;
	binaryOperators: Dictionary<IBinaryOperator, string>;
} = {
	IOperator: Symbol.for('IOperator'),
	map: {
		ILocalization: [
			StartsWithOperator,
			ContainsOperator,
			binaryOperators.equalsOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		String: [
			StartsWithOperator,
			ContainsOperator,
			binaryOperators.equalsOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		Guid: [
			StartsWithOperator,
			ContainsOperator,
			binaryOperators.equalsOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		Int32: [
			binaryOperators.equalsOperator.identifier,
			binaryOperators.greaterOrEqualOperator.identifier,
			binaryOperators.greaterThanOperator.identifier,
			binaryOperators.lowerOrEqualOperator.identifier,
			binaryOperators.lowerThanOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		Float: [
			binaryOperators.equalsOperator.identifier,
			binaryOperators.greaterOrEqualOperator.identifier,
			binaryOperators.greaterThanOperator.identifier,
			binaryOperators.lowerOrEqualOperator.identifier,
			binaryOperators.lowerThanOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		Double: [
			binaryOperators.equalsOperator.identifier,
			binaryOperators.greaterOrEqualOperator.identifier,
			binaryOperators.greaterThanOperator.identifier,
			binaryOperators.lowerOrEqualOperator.identifier,
			binaryOperators.lowerThanOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		DateTimeOffset: [
			binaryOperators.equalsOperator.identifier,
			binaryOperators.greaterOrEqualOperator.identifier,
			binaryOperators.greaterThanOperator.identifier,
			binaryOperators.lowerOrEqualOperator.identifier,
			binaryOperators.lowerThanOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		DateTime: [
			binaryOperators.equalsOperator.identifier,
			binaryOperators.greaterOrEqualOperator.identifier,
			binaryOperators.greaterThanOperator.identifier,
			binaryOperators.lowerOrEqualOperator.identifier,
			binaryOperators.lowerThanOperator.identifier,
			binaryOperators.notEqualOperator.identifier,
		],
		Boolean: [BooleanOperator],
	},
	binaryOperators,
};
