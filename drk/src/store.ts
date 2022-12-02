import { Dictionary } from 'ts-essentials';
import { Point } from './Spatials/Models/Point';
import { IEntityModel } from './Model/IEntityModel';
import { IPropertyModel } from './Model/IPropertyModel';

export type Store = Dictionary<Dictionary<object>>;
export type EqualityComparer<T> = (left: T, right: T) => boolean;
const equalityComparers: Dictionary<EqualityComparer<any>> = {
	Point: (left: Point, right: Point) => left?.x === right?.x && left?.y === right?.y,
	default: (left: any, right: any) => left === right,
};
function propertyEquals<T>(propertyModel: IPropertyModel, left: T, right: T) {
	const leftPropertyValue = left?.[propertyModel.name];
	const rightPropertyValue = right?.[propertyModel.name];
	return (equalityComparers[propertyModel.typeName] ?? equalityComparers.default)(
		leftPropertyValue,
		rightPropertyValue
	);
}
export interface INormalizationContext {
	store?: Store;
	initialStore?: Store;
	cache?: Dictionary<Dictionary<boolean>>;
}

export interface INormalizationResult<TEntity extends object> {
	context: INormalizationContext;
	storedEntity: TEntity;
}

export interface IManyNormalizationResult<TEntity extends object> {
	context: INormalizationContext;
	storedEntities: TEntity[];
}

export function key<TEntity>(model: IEntityModel, entity: TEntity) {
	return model.primaryKey.map((primaryKeyProperty) => entity[primaryKeyProperty.name]).join(',');
}
function equals<TEntity>(model: IEntityModel, left: TEntity, right: TEntity) {
	return model.primaryKey.every(
		(primaryKeyProperty) => left[primaryKeyProperty.name] === right[primaryKeyProperty.name]
	);
}

export function hasPrimaryKey(model: IEntityModel, entity: unknown) {
	return model.primaryKey.every(
		(primaryKeyProperty) => entity?.[primaryKeyProperty.name] !== undefined
	);
}

export function normalizeMany<TEntity extends object>(
	context: INormalizationContext,
	model: IEntityModel,
	entities: TEntity[]
): IManyNormalizationResult<TEntity> {
	if (context.cache === undefined) context.cache = {};
	if (context.store === undefined) context.store = {};
	if (context.initialStore === undefined) context.initialStore = context.store;
	return entities.reduce(
		(result, entity) => {
			const entityNormalizationResult = normalize(result.context, model, entity);
			return {
				context: entityNormalizationResult.context,
				storedEntities: [entityNormalizationResult.storedEntity, ...result.storedEntities],
			};
		},
		{
			context,
			storedEntities: [],
		}
	);
}

export function normalize<TEntity extends object>(
	context: INormalizationContext,
	model: IEntityModel,
	entity: TEntity
): INormalizationResult<TEntity> {
	if (context.cache === undefined) context.cache = {};
	if (context.store === undefined) context.store = {};
	if (context.initialStore === undefined) context.initialStore = context.store;
	const fixableReferences = model.references.filter(
		(reference) =>
			(entity[reference.name] === undefined ||
				!hasPrimaryKey(reference.type, entity[reference.name])) &&
			reference.foreignKey.every(
				(fkProperty) =>
					entity[fkProperty.name] !== undefined && entity[fkProperty.name] !== null
			)
	);
	entity = {
		...entity,
		...Object.fromEntries(
			fixableReferences.map((reference) => [
				reference.name,
				{
					...entity[reference.name],
					...Object.fromEntries(
						reference.foreignKey.map((fk, index) => [
							reference.targetForeignKey[index].name,
							entity[fk.name],
						])
					),
				},
			])
		),
	};
	const cachedStoredEntity = context.cache[model.name]?.[key(model, entity)];
	if (cachedStoredEntity == undefined) {
		if (context.cache[model.name] === undefined) context.cache[model.name] = {};
		context.cache[model.name][key(model, entity)] = true;
		context = updateProperties(context, model, entity);
		context = updateReferences(context, model, entity);
		context = updateCollections(context, model, entity);
		const storedEntity = context.store[model.name][key(model, entity)] as TEntity;
		context = updateDependencies(context, model, storedEntity);
	}
	const storedEntity = context.store[model.name][key(model, entity)] as TEntity;
	return { context, storedEntity };
}

export function updateProperties<TEntity extends object>(
	normalizationContext: INormalizationContext,
	model: IEntityModel,
	entity: TEntity
): INormalizationContext {
	const entityKey = key(model, entity);
	const initialStoredEntity = normalizationContext.initialStore[model.name]?.[
		entityKey
	] as TEntity;
	let storedEntity = normalizationContext.store[model.name]?.[entityKey] as TEntity;
	let keyValuePairs = Object.entries(model.propertyDictionary)
		.filter(
			([propertyKey, property]) =>
				entity[propertyKey] !== undefined && !propertyEquals(property, storedEntity, entity)
		)
		.map(([propertyKey, property]) => [propertyKey, entity[propertyKey]]);
	if (entity['$isDeletion']) {
		normalizationContext = refreshStore(normalizationContext, model);
		if (normalizationContext.store[model.name][entityKey] === initialStoredEntity) {
			normalizationContext.store[model.name][entityKey] = storedEntity = {
				...initialStoredEntity,
				$isDeletion: true,
			};
		} else {
			normalizationContext.store[model.name][entityKey]['$isDeletion'] = true;
		}
	}
	if (keyValuePairs.length) {
		keyValuePairs = [
			...keyValuePairs,
			...model.references
				.filter((reference) => entity[reference.name] === undefined)
				.map((reference) => ({
					reference,
					keys: reference.foreignKey.map((fk) => ({ fk, value: entity[fk.name] })),
				}))
				.filter((tuple) => tuple.keys.every((key) => key.value !== undefined))
				.map((tuple) => [
					tuple.reference.name,
					Object.fromEntries(
						tuple.keys.map((key, index) => [
							tuple.reference.targetForeignKey[index].name,
							key.value,
						])
					),
				]),
		];
		entity = Object.fromEntries(keyValuePairs);
		normalizationContext = refreshStore(normalizationContext, model);
		if (normalizationContext.store[model.name][entityKey] === initialStoredEntity) {
			normalizationContext.store[model.name][entityKey] = storedEntity = {
				...initialStoredEntity,
				...entity,
			};
		} else {
			Object.assign(normalizationContext.store[model.name][entityKey], entity);
		}
	}
	return normalizationContext;
}
export function updateReferences<TEntity extends object>(
	normalizationContext: INormalizationContext,
	model: IEntityModel,
	entity: TEntity
): INormalizationContext {
	const keyValuePairs = Object.entries(model.referenceDictionary).filter(
		([referenceKey, reference]) => entity[referenceKey]
	);
	normalizationContext = keyValuePairs.reduce(
		(normalizationContext, [referenceKey, reference]) => {
			let foreignKeyPropertyIndex = 0;
			for (let foreignKeyProperty of reference.foreignKey) {
				if (
					entity[foreignKeyProperty.name] === undefined &&
					entity[reference.name]?.[
						reference.targetForeignKey[foreignKeyPropertyIndex].name
					] !== undefined
				) {
					normalizationContext.store[model.name][key(model, entity)][
						foreignKeyProperty.name
					] =
						entity[reference.name][
							reference.targetForeignKey[foreignKeyPropertyIndex].name
						];
				}
				foreignKeyPropertyIndex++;
			}
			const referenceNormalizationResult = normalize(
				normalizationContext,
				reference.type,
				entity[reference.name]
			);
			return referenceNormalizationResult.context;
		},
		normalizationContext
	);
	return normalizationContext;
}
export function updateCollections<TEntity extends object>(
	context: INormalizationContext,
	model: IEntityModel,
	entity: TEntity
): INormalizationContext {
	const entityKey = key(model, entity);
	const initialStoredEntity = context.initialStore[model.name]?.[entityKey] as TEntity;
	let storedEntity = context.store[model.name]?.[entityKey] as TEntity;
	const keyValuePairs = Object.entries(model.collectionDictionary);

	context = keyValuePairs.reduce((context, [collectionKey, collection]) => {
		if (!entity[collection.name]) entity[collection.name] = [];
		if (storedEntity && !storedEntity[collection.name]) storedEntity[collection.name] = [];
		context = (entity[collection.name] as any[]).reduce((normalizationContext, item) => {
			const normalizationResult = normalize(context, collection.type, item);
			return normalizationResult.context;
		}, context);
		return context;
	}, context);
	return context;
}
function references<TEntity extends object>(
	principal: TEntity,
	dependent: TEntity,
	principalForeignKey: IPropertyModel[],
	targetForeignKey: IPropertyModel[]
) {
	return principalForeignKey.reduce(
		(equality, property, index) =>
			equality && dependent[property.name] == principal[targetForeignKey[index].name],
		true
	);
}
export function updateDependencies<TEntity extends object>(
	normalizationContext: INormalizationContext,
	model: IEntityModel,
	storedEntity: TEntity
): INormalizationContext {
	const storedEntityKey = key(model, storedEntity);
	const isDeletion = storedEntity['$isDeletion'];
	normalizationContext = model.dependents.reduce((normalizationContext, dependent) => {
		const dependentReference = dependent.references.find((ref) => ref.type == model);
		if (normalizationContext.store[dependent.name]) {
			const dependentInstances = Object.values(
				normalizationContext.store[dependent.name]
			).filter((dependentInstance) => {
				const targetForeignKey = dependentReference.isDependentToPrincipal
					? dependentReference.targetForeignKey
					: dependentReference.foreignKey;
				const foreignKey = dependentReference.isDependentToPrincipal
					? dependentReference.foreignKey
					: dependentReference.targetForeignKey;
				return references(storedEntity, dependentInstance, foreignKey, targetForeignKey);
			});
			normalizationContext = dependentInstances.reduce<INormalizationContext>(
				(normalizationContext, dependentInstance) => {
					if (dependentInstance[dependentReference.name] !== storedEntity) {
						const dependentInstanceKey = key(dependent, dependentInstance);
						const initialDependentInstance =
							normalizationContext.initialStore[dependent.name]?.[
								dependentInstanceKey
							];
						normalizationContext = refreshStore(normalizationContext, dependent);
						if (
							normalizationContext.store[dependent.name][dependentInstanceKey] ===
							initialDependentInstance
						) {
							normalizationContext.store[dependent.name][dependentInstanceKey] =
								dependentInstance = {
									...dependentInstance,
									[dependentReference.name]: storedEntity,
								};
							normalizationContext = updateDependencies(
								normalizationContext,
								dependent,
								dependentInstance
							);
						} else {
							dependentInstance[dependentReference.name] = storedEntity;
						}
					}
					return { ...normalizationContext, model, storedEntity };
				},
				normalizationContext
			);
		}
		return normalizationContext;
	}, normalizationContext);
	normalizationContext = model.collectionDependents.reduce((normalizationContext, dependent) => {
		const dependentCollection = dependent.collections.find((ref) => ref.type == model);
		const reference = dependentCollection.type.references.find((ref) =>
			assignableFrom(ref.type, dependent)
		);
		if (reference) {
			const targetForeignKey = reference.isDependentToPrincipal
				? reference.targetForeignKey
				: reference.foreignKey;
			const foreignKey = reference.isDependentToPrincipal
				? reference.foreignKey
				: reference.targetForeignKey;

			if (normalizationContext.store[reference.type.name]) {
				const dependentInstances = Object.values(
					normalizationContext.store[reference.type.name]
				).filter((dependentEntry) =>
					foreignKey.reduce(
						(equality, property, index) =>
							equality &&
							storedEntity[property.name] ==
								dependentEntry[targetForeignKey[index].name],
						true
					)
				);
				normalizationContext = dependentInstances.reduce<INormalizationContext>(
					(normalizationContext, dependentInstance) => {
						if (dependentInstance[dependentCollection.name] === undefined)
							dependentInstance[dependentCollection.name] = [];
						let collection = dependentInstance[dependentCollection.name] ?? [];
						const dependentCollectionItemIndex = collection.findIndex((item) =>
							equals(model, item, storedEntity)
						);
						const dependentInstanceKey = key(dependent, dependentInstance);
						normalizationContext = refreshStore(normalizationContext, dependent);
						const initialStoredDependentInstance =
							normalizationContext.initialStore[dependent.name]?.[
								dependentInstanceKey
							];
						if (dependentCollectionItemIndex >= 0) {
							let dependentCollectionItem = collection[dependentCollectionItemIndex];
							//if (dependentCollectionItem !== normalizationContext.storedEntity) {
							const replacementItems = isDeletion ? [] : [storedEntity];

							if (initialStoredDependentInstance === dependentInstance) {
								collection.splice(
									dependentCollectionItemIndex,
									1,
									...replacementItems
								);
								normalizationContext.store[dependent.name][dependentInstanceKey] =
									dependentInstance = {
										...dependentInstance,
										[dependentCollection.name]: Array.from(collection),
									};
								if (!isDeletion) {
									normalizationContext = updateDependencies(
										normalizationContext,
										dependent,
										dependentInstance
									);
								}
							} else {
								if (
									initialStoredDependentInstance[dependentCollection.name] ===
									collection
								) {
									collection = dependentInstance[dependentCollection.name] =
										Array.from(collection);
								} else {
									collection.splice(
										dependentCollectionItemIndex,
										1,
										...replacementItems
									);
								}
							}
							//}
						} else {
							if (!isDeletion) {
								if (initialStoredDependentInstance === dependentInstance) {
									collection.push(storedEntity);
									normalizationContext.store[dependent.name][
										dependentInstanceKey
									] = dependentInstance = {
										...dependentInstance,
										[dependentCollection.name]: Array.from(collection),
									};
									normalizationContext = updateDependencies(
										normalizationContext,
										dependent,
										dependentInstance
									);
								} else {
									if (
										initialStoredDependentInstance?.[
											dependentCollection.name
										] === collection
									) {
										collection = dependentInstance[dependentCollection.name] =
											Array.from(collection);
									} else {
										collection.push(storedEntity);
									}
								}
							}
						}
						return normalizationContext;
					},
					normalizationContext
				);
			}
		}
		return normalizationContext;
	}, normalizationContext);
	if (isDeletion) {
		normalizationContext = refreshStore(normalizationContext, model);
		delete normalizationContext.store[model.name][storedEntityKey];
	}
	return normalizationContext;
}

function assignableFrom(base: IEntityModel, value: IEntityModel) {
	return base == value || (value.parent && assignableFrom(base, value.parent));
}

function refreshStore(normalizationContext: INormalizationContext, model: IEntityModel) {
	if (normalizationContext.store === normalizationContext.initialStore)
		normalizationContext.store = {
			...normalizationContext.initialStore,
		};
	if (normalizationContext.store[model.name] === normalizationContext.initialStore[model.name])
		normalizationContext.store[model.name] = {
			...normalizationContext.initialStore[model.name],
		};
	return normalizationContext;
}
