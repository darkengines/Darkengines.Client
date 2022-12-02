import Queryable from './Queryable';
import IncludableQueryable from './IncludableQueryable';
import { ScopedLambda } from './LambdaExpression';

declare module './Queryable' {
	export default interface Queryable<T> {
		where<T>(
			this: Queryable<T[]>,
			predicate: ((x: T) => boolean) | ScopedLambda<(x: T) => boolean, any>
		): Queryable<T[]>;
		map<T, TOut>(
			this: Queryable<T[]>,
			selector: ScopedLambda<(x: T) => TOut, any>
		): Queryable<TOut[]>;
		take<T>(this: Queryable<T[]>, count: number): Queryable<T[]>;
		distinct<T>(this: Queryable<T[]>): Queryable<T[]>;
		skip<T>(this: Queryable<T[]>, count: number): Queryable<T[]>;
		orderBy<T, TProperty>(
			this: Queryable<T[]>,
			selector: ((x: T) => TProperty) | ScopedLambda<(x: T) => TProperty, any>
		): Queryable<T[]>;
		orderByDescending<T, TProperty>(
			this: Queryable<T[]>,
			selector: ScopedLambda<(x: T) => TProperty, any>
		): Queryable<T[]>;
		count<T>(this: Queryable<T[]>): Queryable<number>;
		include<T, TProperty>(
			this: Queryable<T[]>,
			selector: (x: T) => TProperty | ScopedLambda<(x: T) => TProperty, any>
		): IncludableQueryable<T[], TProperty>;
	}
}
Queryable.prototype.where = function where<T>(
	predicate: ((x: T) => boolean) | ScopedLambda<(x: T) => boolean, any>
): Queryable<T[]> {
	const queryable = new Queryable<T[]>(
		Queryable.methodCallExpression(this.expression, 'Where', predicate),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.map = function map<T, TOut>(
	selector: ScopedLambda<(x: T) => TOut, any>
): Queryable<TOut[]> {
	const queryable = new Queryable<TOut[]>(
		Queryable.methodCallExpression(this.expression, 'Select', selector),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.skip = function skip<T>(count: number): Queryable<T[]> {
	const queryable = new Queryable<T[]>(
		Queryable.methodCallExpression(this.expression, 'Skip', count),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.take = function take<T>(count: number): Queryable<T[]> {
	const queryable = new Queryable<T[]>(
		Queryable.methodCallExpression(this.expression, 'Take', count),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.distinct = function distinct<T>(): Queryable<T[]> {
	const queryable = new Queryable<T[]>(
		Queryable.methodCallExpression(this.expression, 'Distinct'),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.orderBy = function orderBy<T, TProperty>(
	selector: ScopedLambda<(x: T) => TProperty, any>
): Queryable<T[]> {
	const queryable = new Queryable<T[]>(
		Queryable.methodCallExpression(this.expression, 'OrderBy', selector),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.orderByDescending = function orderByDescending<T, TProperty>(
	selector: ScopedLambda<(x: T) => TProperty, any>
): Queryable<T[]> {
	const queryable = new Queryable<T[]>(
		Queryable.methodCallExpression(this.expression, 'OrderByDescending', selector),
		this.executor,
		this.action
	);
	return queryable;
};
Queryable.prototype.count = function take<T>(this: Queryable<T[]>): Queryable<number> {
	const queryable = new Queryable<number>(
		Queryable.methodCallExpression(this.expression, 'Count'),
		this.executor
	);
	return queryable;
};
Queryable.prototype.include = function include<T, TProperty>(
	this: Queryable<T[]>,
	selector: (x: T) => TProperty | ScopedLambda<(x: T) => TProperty, any>
): IncludableQueryable<T[], TProperty> {
	const queryable = new IncludableQueryable<T[], TProperty>(
		Queryable.methodCallExpression(this.expression, 'Include', selector),
		this.executor,
		this.action
	);
	return queryable;
};

declare module './IncludableQueryable' {
	export default interface IncludableQueryable<TEntity, TPreviousInclude> {
		thenInclude<TEntity, TProperty, TPreviousInclude>(
			this: IncludableQueryable<TEntity[], TPreviousInclude[]>,
			selector: (
				x: TPreviousInclude
			) => TProperty | ScopedLambda<(x: TPreviousInclude) => TProperty, any>
		): IncludableQueryable<TEntity[], TProperty>;
		thenInclude<TEntity, TProperty>(
			this: IncludableQueryable<TEntity[], TPreviousInclude>,
			selector: (
				x: TPreviousInclude
			) => TProperty | ScopedLambda<(x: TPreviousInclude) => TProperty, any>
		): IncludableQueryable<TEntity[], TProperty>;
	}
}

IncludableQueryable.prototype.thenInclude = function thenInclude<T, TPreviousInclude, TProperty>(
	this: Queryable<T[]>,
	selector: (
		x: TPreviousInclude
	) => TProperty | ScopedLambda<(x: TPreviousInclude) => TProperty, any>
): IncludableQueryable<T[], TProperty> {
	const queryable = new IncludableQueryable<T[], TProperty>(
		Queryable.methodCallExpression(this.expression, 'ThenInclude', selector),
		this.executor,
		this.action
	);
	return queryable;
};
IncludableQueryable.prototype.thenInclude = function thenInclude<T, TPreviousInclude, TProperty>(
	this: IncludableQueryable<T[], TPreviousInclude[]>,
	selector: (
		x: TPreviousInclude
	) => TProperty | ScopedLambda<(x: TPreviousInclude) => TProperty, any>
): IncludableQueryable<T[], TProperty> {
	const queryable = new IncludableQueryable<T[], TProperty>(
		Queryable.methodCallExpression(this.expression, 'ThenInclude', selector),
		this.executor,
		this.action
	);
	return queryable;
};
