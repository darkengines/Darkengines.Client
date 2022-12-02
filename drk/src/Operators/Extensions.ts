import { Container } from 'inversify';
import { Newable } from 'ts-essentials';
import { BinaryOperator } from './BinaryOperator';
import { BooleanOperator } from './BooleanOperator';
import { ContainsOperator } from './ContainsOperator';
import { IOperator } from './IOperator';
import { StartsWithOperator } from './StartsWithOperator';
import { Operators } from './Symbols';

export function addOperator<TOperator extends IOperator>(
	container: Container,
	operatorContructor: Newable<TOperator>
) {
	container.bind(operatorContructor).toSelf().inSingletonScope();
	container.bind<IOperator>(Operators.IOperator).toService(operatorContructor);
	return container;
}

export function addOperators(container: Container) {
	Object.values(Operators.binaryOperators).forEach((binaryOperator) => {
		const operator = new BinaryOperator(binaryOperator);
		container.bind(binaryOperator.identifier).toConstantValue(operator);
		container.bind<IOperator>(Operators.IOperator).toConstantValue(operator);
	});
	addOperator(container, StartsWithOperator);
	addOperator(container, ContainsOperator);
	addOperator(container, BooleanOperator);
	return container;
}
