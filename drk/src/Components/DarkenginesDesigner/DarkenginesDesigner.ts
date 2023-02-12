import { msg, str } from '@lit/localize';
import { ICollectionModel } from 'drk/src/Model/ICollectionModel';
import { IEntityModel } from 'drk/src/Model/IEntityModel';
import { IMember } from 'drk/src/Model/IMember';
import { IModel } from 'drk/src/Model/IModel';
import { INavigation } from 'drk/src/Model/INavigation';
import { IPropertyModel } from 'drk/src/Model/IPropertyModel';
import { IReferenceModel } from 'drk/src/Model/IReferenceModel';
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValueMap, svg } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref';
import { repeat } from 'lit/directives/repeat.js';
import { flatten } from 'lodash';
import { Dictionary } from 'ts-essentials';
import { mdcElevation } from '../../Styles/Material/index';

export interface IDesigner {}
export interface IPosition {
	x: number;
	y: number;
}
export interface ItemSlotSet {
	header: Slot[];
	footer: Slot[];
}
export interface Item {
	model: IEntityModel;
	position: IPosition;
	members?: Dictionary<PropertyMember | ReferenceMember | CollectionMember>;
	properties: Dictionary<PropertyMember>;
	references: Dictionary<ReferenceMember>;
	collections: Dictionary<CollectionMember>;
	htmlElement?: HTMLElement;
	slots?: ItemSlotSet;
}
export interface Member {
	htmlElement?: HTMLElement;
	member: IPropertyModel | IReferenceModel | ICollectionModel;
	slots: Slot[];
}
export interface PropertyMember extends Member {
	member: IPropertyModel;
}
export interface ReferenceMember extends Member {
	member: IReferenceModel;
	targetItem: Item;
}
export interface CollectionMember extends Member {
	member: ICollectionModel;
	targetItem: Item;
}
export enum SlotPositionType {
	Left,
	Right,
}
export interface Slot {
	htmlElement?: HTMLElement;
	type: SlotPositionType;
}

export interface Edge {
	source: Slot[];
	destination: Slot[];
}

export interface StuffContext {
	cache: Dictionary<Item>;
	edges: Edge[];
}

@customElement('drk-designer')
export class Designer extends LitElement {
	protected static createSlotElement(positionType: SlotPositionType) {
		const slot = document.createElement('div');
		slot.classList.add('slot');
		if (positionType == SlotPositionType.Left) slot.classList.add('left');
		if (positionType == SlotPositionType.Right) slot.classList.add('right');
		return slot;
	}
	protected doAllStuff(models: IEntityModel[]) {
		const cache: Dictionary<Item> = {};
		const context: StuffContext = {
			cache,
			edges: [],
		};
		const items = models.map((model) => this.doStuff(model, context));
		return context;
	}
	protected doStuff(model: IEntityModel, context: StuffContext) {
		const leftHeaderSlotElement = Designer.createSlotElement(SlotPositionType.Left);
		const rightHeaderSlotElement = Designer.createSlotElement(SlotPositionType.Right);
		const leftHeaderSlot = { htmlElement: leftHeaderSlotElement, type: SlotPositionType.Left };
		const rightHeaderSlot = {
			htmlElement: rightHeaderSlotElement,
			type: SlotPositionType.Right,
		};
		const leftFooterSlotElement = Designer.createSlotElement(SlotPositionType.Left);
		const rightFooterSlotElement = Designer.createSlotElement(SlotPositionType.Right);
		const leftFooterSlot = { htmlElement: leftFooterSlotElement, type: SlotPositionType.Left };
		const rightFooterSlot = {
			htmlElement: rightFooterSlotElement,
			type: SlotPositionType.Right,
		};

		if (context.cache.hasOwnProperty(model.name)) return context.cache[model.name];
		const item: Item = {
			position: { x: 0, y: 0 },
			model,
			slots: {
				header: [leftHeaderSlot, rightHeaderSlot],
				footer: [leftFooterSlot, rightFooterSlot],
			},
			members: {},
			properties: {},
			references: {},
			collections: {},
		};
		context.cache[model.name] = item;

		model.properties.forEach((property) => {
			const slots = [];
			const member = {
				member: property,
				slots,
			};
			item.members[property.name] = item.properties[property.name] = member;
		});
		model.references.forEach((reference) => {
			const leftMemberSlotElement = Designer.createSlotElement(SlotPositionType.Left);
			const rightMemberSlotElement = Designer.createSlotElement(SlotPositionType.Right);
			const slots = [
				{
					htmlElement: leftMemberSlotElement,
					type: SlotPositionType.Left,
				},
				{
					htmlElement: rightMemberSlotElement,
					type: SlotPositionType.Right,
				},
			];
			const member: ReferenceMember = {
				member: reference,
				slots,
				targetItem: undefined,
			};
			item.members[reference.name] = item.references[reference.name] = member;
			member.targetItem = this.doStuff(reference.type, context);

			if (reference.isDependentToPrincipal) {
				const edge: Edge = {
					source: slots,
					destination: member.targetItem.slots.header,
				};
				context.edges.push(edge);
			}
		});

		model.collections.forEach((collection) => {
			const leftMemberSlotElement = Designer.createSlotElement(SlotPositionType.Left);
			const rightMemberSlotElement = Designer.createSlotElement(SlotPositionType.Right);
			const slots = [
				{
					htmlElement: leftMemberSlotElement,
					type: SlotPositionType.Left,
				},
				{
					htmlElement: rightMemberSlotElement,
					type: SlotPositionType.Right,
				},
			];
			const member: CollectionMember = {
				member: collection,
				slots,
				targetItem: undefined,
			};
			item.members[collection.name] = item.collections[collection.name] = member;
			member.targetItem = this.doStuff(collection.type, context);

			if (collection.isDependentToPrincipal) {
				const edge: Edge = {
					source: slots,
					destination: member.targetItem.slots.header,
				};
				context.edges.push(edge);
			}
		});
		return item;
	}
	protected _models: IEntityModel[];
	@state()
	protected items: Item[] = [];
	public set models(models: IEntityModel[]) {
		this._models = models;
		const context = this.doAllStuff(this._models);
		this.edges = context.edges;
		this.items = Object.values(context.cache);
		// let slots = [];
		// let edges = [];
		// models.forEach((model) => {
		// 	model.references
		// 		.filter((reference) => reference.isDependentToPrincipal)
		// 		.forEach((reference) => {
		// 			const targetTypeName = `${reference.type.namespace}.${reference.type.name}`;
		// 			const sourceTypeName = `${model.namespace}.${model.name}`;
		// 			const sourceMemberName = reference.name;
		// 		});
		// });
		// this.items = this._models.map((model) => {
		// 	const slot = document.createElement('div');
		// 	slot.classList.add('slot');
		// 	const headerSlot = { htmlElement: slot, type: SlotPositionType.Left };
		// 	slots.push(headerSlot);

		// 	return {
		// 		model: model,
		// 		position: { x: 0, y: 0 },
		// 		slots: {
		// 			header: [headerSlot],
		// 			footer: [],
		// 		},
		// 		members: [...model.properties, ...model.references, ...model.collections].map(
		// 			(member) => {
		// 				if (member.modelType == 'ReferenceModel' && member.isDependentToPrincipal) {
		// 				}

		// 				const slot = document.createElement('div');
		// 				slot.classList.add('slot');
		// 				const memberSlot = {
		// 					htmlElement: slot,
		// 					type: SlotPositionType.Left,
		// 				};
		// 				slots.push(memberSlot);
		// 				return {
		// 					member,
		// 					slots: [memberSlot],
		// 				};
		// 			}
		// 		),
		// 	};
		// });

		// this.items.forEach((item) => {
		// 	item.members
		// 		.filter(
		// 			(member) =>
		// 				member.member.modelType == 'ReferenceModel' &&
		// 				member.member.isDependentToPrincipal
		// 		)
		// 		.forEach((member) => {
		// 			const reference = member.member as IReferenceModel;
		// 			member.slots;
		// 		});
		// });
	}
	public get models(): IEntityModel[] {
		return this._models;
	}
	@property({ type: Number })
	public zoom: number = 0;
	@query('#viewport')
	protected viewport: HTMLDivElement;
	@query('#plane')
	protected plane: HTMLDivElement;
	@property({ type: Object })
	public view = {
		distance: 1,
		center: { x: 0, y: 0 },
	};
	@queryAll('.box')
	protected boxElements: NodeListOf<HTMLDivElement>;

	@property({ type: Array })
	public edges: Edge[] = [];

	//@property({ type: Object })
	protected center: { x: number; y: number };

	public static get styles() {
		return [
			mdcElevation,
			css`
				:host {
					display: grid;
					grid-template-columns: auto 1fr;
					padding: var(--content-padding);
					width: 100%;
					max-width: 100%;
					height: 100%;
					max-height: 100%;
					grid-gap: 8px;
				}
				.toolbox {
					display: block;
					min-width: 256px;
					width: 100%;
					height: 100%;
					max-width: 100%;
					max-height: 100%;
					border: solid 4px lightblue;
					border-radius: var(--border-radius);
				}
				.viewport {
					cursor: grab;
					position: relative;
					display: block;
					overflow: hidden;
					border-radius: var(--border-radius);
					height: 100%;
					max-height: 100%;
					width: 100%;
					perspective: 1px;
					perspective-origin: center;
					border: solid 4px lightcoral;
				}
				.viewport.dragging {
					cursor: grabbing;
				}
				.plane {
					-webkit-backface-visibility: hidden;
					transform-style: preserve-3d;
					position: absolute;
					display: block;
					height: 100%;
					width: 100%;
					background-image: linear-gradient(
							rgba(var(--primary-color-rgb), 0.33) 1px,
							transparent 1px
						),
						linear-gradient(
							to right,
							rgba(var(--primary-color-rgb), 0.33) 1px,
							transparent 1px
						);
					background-size: 16px 16px;
					background-color: var(--surface-background-color);
					border: solid 4px lightgreen;
				}
				.box {
					-webkit-backface-visibility: hidden;
					grid-template-rows: auto 1fr auto;
					border-radius: var(--border-radius);
					border: 2px solid var(--primary-color);
					background-color: var(--surface-background-color);
					display: inline-grid;
					place-content: start;
					transform-style: preserve-3d;
					-webkit-font-smoothing: subpixel-antialiased;
				}
				.box .header {
					padding: calc(var(--content-padding) / 2);
					/* border-bottom: 2px solid var(--primary-color); */
					font-stretch: expanded;
					font-weight: bold;
					position: relative;
				}
				.box .body {
					padding: calc(var(--content-padding) / 2);
				}
				.box .slot {
					background-color: var(--primary-color);
					width: 8px;
					height: 8px;
					border-radius: 100%;
					position: absolute;
					top: 50%;
					transform: translateX(-50%) translateY(-50%);
				}
				.box .slot.left {
					left: -1px;
				}
				.box .slot.right {
					right: -1px;
				}
				.box .member {
					padding: calc(var(--content-padding) / 2);
					position: relative;
				}
				.member + .member {
					border-top: 1px solid rgba(var(--primary-color-light-rgb), 0.33);
				}
				.box .footer {
					border-top: 2px solid var(--primary-color);
					padding: calc(var(--content-padding) / 2);
				}
				.box.moving {
					cursor: move;
				}
				.type {
					color: var(--primary-color);
				}
				.members {
					display: grid;
					grid-auto-flow: row;
					width: 100%;
					align-items: start;
					position: relative;
				}
				.properties {
				}
				.references {
				}
				.collections {
				}
				.banner {
					font-stretch: expanded;
					font-weight: bold;
					font-size: x-small;
					padding: calc(var(--content-padding) / 8) calc(var(--content-padding) / 2);
					border-bottom: 1px solid rgba(var(--primary-color-light-rgb), 0.33);
					background-color: var(--primary-color);
					color: var(--on-primary-color);
				}
				.banner mwc-icon {
					font-weight: lighter;
					font-size: initial;
				}
				.banner * {
					vertical-align: middle;
				}
			`,
		];
	}
	protected async updated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): Promise<void> {
		super.updated(_changedProperties);

		if (this.view.distance <= 1) {
			this.plane.style.width = '500%';
			this.plane.style.height = '500%';
		}
		this.plane.style.transform = `translateX(${this.view.center.x}px) translateY(${
			this.view.center.y
		}px) translateZ(${-this.view.distance + 1}px)`;
	}
	protected getOffset(element: HTMLElement, relativeElement: HTMLElement) {
		var offset = {
			x: element.offsetLeft,
			y: element.offsetTop,
		};
		if (element.parentElement !== relativeElement) {
			const parentOffset = this.getOffset(element.parentElement, relativeElement);
			offset.x += parentOffset.x;
			offset.y += parentOffset.y;
		}
		return offset;
	}
	public messages = {
		dependents_plural: (count: number) => msg(str`referenced ${count} times`),
		dependents_singular: () => msg(str`referenced 1 time`),
		no_dependents: () => msg(str`not referenced`),
		dependents: (count: number) => {
			if (count == 0) return this.messages.no_dependents();
			if (count == 1) return this.messages.dependents_singular();
			return this.messages.dependents_plural(count);
		},
		properties: () => msg('Properties'),
		references: () => msg('References'),
		collections: () => msg('Collections'),
	};
	protected a = 0;
	protected b = 0;
	public renderItem(item: Item, itemIndex: number) {
		const propertyOffset = 0;
		const referenceOffset = item.model.properties.length;
		const collectionOffset = referenceOffset + item.model.references.length;
		return html`<div
			class="box"
			style="position: absolute; left: ${item.position.x}px; top: ${item.position.y}px"
			@mousedown=${(e: MouseEvent) => {
				const divElement = e.currentTarget as HTMLDivElement;
				divElement.classList.add('moving');
				const onMouseMove = (e: DragEvent) => {
					this.items[itemIndex] = {
						...this.items[itemIndex],
						position: {
							...this.items[itemIndex].position,
							x: this.items[itemIndex].position.x + e.movementX * this.view.distance,
							y: this.items[itemIndex].position.y + e.movementY * this.view.distance,
						},
					};
					this.requestUpdate('items');
					e.stopPropagation();
					e.preventDefault();
				};
				const onMouseUp = (e: DragEvent) => {
					this.removeEventListener('mousemove', onMouseMove);
					this.a--;
					this.removeEventListener('mouseup', onMouseUp);
					this.b--;
					console.log(this.a, this.b);
					e.stopPropagation();
					e.preventDefault();
					divElement.classList.remove('moving');
				};
				this.addEventListener('mousemove', onMouseMove);
				this.a++;
				this.addEventListener('mouseup', onMouseUp);
				this.b++;
				console.log(this.a, this.b);
				e.stopPropagation();
				e.preventDefault();
			}}
		>
			<div class="header">
				${item.model.name}${repeat(item.slots.header, (slot) => slot.htmlElement)}
			</div>

			${this.renderProperties(Object.values(item.properties))}
			${this.renderReferences(Object.values(item.references))}
			${this.renderCollections(Object.values(item.collections))}

			<div class="footer">${this.messages.dependents(item.model.dependents.length)}</div>
		</div>`;
	}
	public renderProperties(properties: PropertyMember[]) {
		if (properties.length <= 0) return nothing;
		return html`<div class="banner">${this.messages.properties()}</div>
			<div class="members properties">
				${repeat(properties, (property, index) => this.renderProperty(property))}
			</div>`;
	}
	public renderReferences(references: ReferenceMember[]) {
		if (references.length <= 0) return nothing;
		return html`<div class="banner">${this.messages.references()}</div>
			<div class="members references">
				${repeat(references, (reference, index) => this.renderReference(reference))}
			</div>`;
	}
	public renderCollections(collections: CollectionMember[]) {
		if (collections.length <= 0) return nothing;
		return html`<div class="banner">${this.messages.collections()}</div>
			<div class="members collections">
				${repeat(collections, (collection, index) => this.renderCollection(collection))}
			</div>`;
	}
	public renderProperty(property: PropertyMember) {
		return html`<div class="member property">
			<span class="type">${property.member.typeName}</span>&nbsp;${property.member.name}
			${repeat(property.slots, (slot, index) => slot.htmlElement)}
		</div>`;
	}
	public renderReference(reference: ReferenceMember) {
		return html`<div class="member reference">
			<span class="type">${reference.member.type.name}</span>&nbsp;${reference.member.name}
			${repeat(reference.slots, (slot, index) => slot.htmlElement)}
		</div>`;
	}
	public renderCollection(collection: CollectionMember) {
		return html`<div class="member collection">
			<span class="type">ICollection&lt;${collection.member.type.name}&gt;</span
			>&nbsp;${collection.member.name}
			${repeat(collection.slots, (slot, index) => slot.htmlElement)}
		</div>`;
	}
	public renderEdges(edges: Edge[]) {
		return html`<svg
			fill="transparent"
			stroke="black"
			stroke-width="2px"
			style="overflow: visible; position: absolute;"
		>
			<marker
				id="triangle"
				viewBox="0 0 8 8"
				refX="1"
				refY="4"
				markerUnits="strokeWidth"
				markerWidth="8"
				markerHeight="8"
				orient="auto"
			>
				<path
					d="M 1 1 L 7 4 L 1 7 z"
					fill="#fff"
					style="stroke-width: 1px; fill: transparent;"
				></path>
			</marker>
			${repeat(edges, (edge) => {
				const destinations = edge.destination.map((destination) => ({
					offset: this.getOffset(destination.htmlElement, this.plane),
					destination,
				}));
				const sources = edge.source.map((source) => ({
					offset: this.getOffset(source.htmlElement, this.plane),
					source,
				}));

				const paths = flatten(
					sources.map((source) => {
						return destinations.map((destination) => ({
							source,
							destination,
						}));
					})
				);

				const sortedPaths = paths.sort(
					(left, right) =>
						this.squaredDistance(left.source.offset, left.destination.offset) -
						this.squaredDistance(right.source.offset, right.destination.offset)
				);
				const shortestPath = sortedPaths[0];
				const inputElement = shortestPath.destination.destination.htmlElement;
				const outputElement = shortestPath.source.source.htmlElement;

				const outputPosition = shortestPath.source.offset;
				const inputPosition = shortestPath.destination.offset;

				let sourceDirection = { x: -1, y: 0 };
				if (shortestPath.source.source.type == SlotPositionType.Left) {
					sourceDirection = { x: -1, y: 0 };
				}
				if (shortestPath.source.source.type == SlotPositionType.Right) {
					sourceDirection = { x: 1, y: 0 };
				}

                let destinationDirection = { x: -1, y: 0 };
				if (shortestPath.destination.destination.type == SlotPositionType.Left) {
					destinationDirection = { x: -1, y: 0 };
				}
				if (shortestPath.destination.destination.type == SlotPositionType.Right) {
					destinationDirection = { x: 1, y: 0 };
				}

				return svg`<path marker-end="url(#triangle)" d="M${outputPosition.x} ${
					outputPosition.y
				} C${outputPosition.x + sourceDirection.x * 64} ${outputPosition.y}, ${
					inputPosition.x + destinationDirection.x * 64
				} ${inputPosition.y}, ${inputPosition.x + destinationDirection.x * 16} ${inputPosition.y}">`;
			})}
		</svg>`;
	}
	protected squaredDistance(x: IPosition, y: IPosition) {
		const dx = x.x - y.x;
		const dy = x.y - y.y;
		return dx * dx + dy * dy;
	}
	public render() {
		return html`<div id="toolbox" class="toolbox"></div>
			<div
				id="viewport"
				class="viewport mdc-elevation--z1"
				@mousedown=${(e: MouseEvent) => {
					this.viewport.classList.add('dragging');
					const onMouseMove = (e: DragEvent) => {
						this.view = {
							...this.view,
							center: {
								...this.view.center,
								x: this.view.center.x + e.movementX * this.view.distance,
								y: this.view.center.y + e.movementY * this.view.distance,
							},
						};
					};
					const onMouseUp = (e: DragEvent) => {
						this.removeEventListener('mousemove', onMouseMove);
						this.removeEventListener('mouseup', onMouseUp);
						this.viewport.classList.remove('dragging');
					};
					this.addEventListener('mousemove', onMouseMove);
					this.addEventListener('mouseup', onMouseUp);
				}}
				@wheel=${(e: WheelEvent) => {
					this.view = {
						...this.view,
						distance: (this.view.distance += e.deltaY * 0.001),
					};
					e.preventDefault();
				}}
			>
				<div id="plane" class="plane">
					${repeat(this.items, (item, index) => {
						return this.renderItem(item, index);
					})}
					${this.renderEdges(this.edges)}
				</div>
			</div>`;
	}
}
