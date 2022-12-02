import { Dictionary } from 'ts-essentials';

declare global {
	interface Array<T> {
		where(this: Array<T>, predicate: (x: T) => boolean): Array<T>;
		any(this: Array<T>, predicate?: (x: T) => boolean): boolean;
		take(this: Array<T>, count: number): Array<T>;
		skip(this: Array<T>, count: number): Array<T>;
		orderBy<TProperty>(this: Array<T>, selector: (x: T) => TProperty): Array<T>;
		orderByDescending<TProperty>(this: Array<T>, selector: (x: T) => TProperty, any): Array<T>;
		count(this: Array<T>): number;
		flatten(this: Array<Array<T>>): Array<T>;
		distinct(this: Array<T>, comparer?: (left: T, right: T) => boolean);
		toDictionary<T, TValue = T>(
			this: Array<T>,
			keySelector: (item: T) => string,
			valueSelector?: (item: T) => TValue
		): Dictionary<TValue>;
		update<TValue>(
			this: Array<T>,
			value: Array<TValue>,
			equalityComparer: (item: T, valueItem: TValue) => boolean,
			converter: (value: TValue) => T
		);
	}
}
Array.prototype.where = function where<T>(this: Array<T>, predicate: (x: T) => boolean): Array<T> {
	return this.filter(predicate);
};
Array.prototype.any = function any<T>(this: Array<T>, predicate: (x: T) => boolean): boolean {
	return predicate ? this.some(predicate) : !!this.length;
};
Array.prototype.skip = function skip<T>(this: Array<T>, count: number): Array<T> {
	return this.slice(count);
};
Array.prototype.take = function take<T>(this: Array<T>, count: number): Array<T> {
	return this.slice(0, count);
};
Array.prototype.orderBy = function orderBy<T, TProperty>(
	this: Array<T>,
	selector: (x: T) => TProperty
): Array<T> {
	return this.sort((left, right) => (selector(left) as any) - (selector(right) as any));
};
Array.prototype.orderByDescending = function orderByDescending<T, TProperty>(
	this: Array<T>,
	selector: (x: T) => TProperty
): Array<T> {
	return this.sort((left, right) => (selector(right) as any) - (selector(left) as any));
};
Array.prototype.count = function take<T>(this: Array<T>): number {
	return this.length;
};
Array.prototype.update = function <T, TValue>(
	this: Array<T>,
	values: Array<TValue>,
	equalityComparer: (item: T, valueItem: TValue) => boolean,
	converter: (value: TValue) => T
) {
	const itemStack = Array.from(this);
	const valueStack = Array.from(values);
	const toUpdate: { item: T; value: TValue }[] = [];
	let itemIndex = 0;
	while (itemIndex < itemStack.length) {
		const item = itemStack[itemIndex];
		let valueIndex = 0;
		let found = false;
		while (!found && valueIndex < valueStack.length) {
			const value = valueStack[valueIndex];
			if ((found = equalityComparer(item, value))) {
				toUpdate.push({
					item: itemStack.splice(itemIndex, 1)[0],
					value: valueStack.splice(valueIndex, 1)[0],
				});
			} else {
				valueIndex++;
			}
		}
		if (!found) itemIndex++;
	}
	if (!itemStack.length && !valueStack.length) return this;
	return [...toUpdate.map((tuple) => tuple.item), ...valueStack.map(converter)];
};

Array.prototype.flatten = function flatten<T>(this: Array<Array<T>>): Array<T> {
	return [].concat(...this);
};
Array.prototype.distinct = function distinct<T>(
	this: Array<T>,
	comparer: (left: T, right: T) => boolean = (left, right) => left === right
) {
	const [head, ...tail] = this;
	return this.reduce(
		(result, item) => {
			if (!result.some((left) => comparer(left, item))) result.push(item);
			return result;
		},
		[head]
	);
};
Array.prototype.toDictionary = function toDictionary<T, TValue = T>(
	this: Array<T>,
	keySelector: (item: T) => string,
	valueSelector: (item: T) => TValue = (value) => value as any
) {
	const [head, ...tail] = this;
	if (!head) return {} as Dictionary<TValue>;
	return tail.reduce(
		(dictionary, item) => ({
			...dictionary,
			[keySelector(item)]: valueSelector(item),
		}),
		{
			[keySelector(head)]: valueSelector(head),
		}
	);
};
