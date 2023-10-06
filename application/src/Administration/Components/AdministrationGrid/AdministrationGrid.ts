import {
	IDarkenginesGridActions,
	IDarkenginesGridProps,
} from '@drk/src/Components/DarkenginesGrid/IDarkenginesGrid';
import {
	DarkenginesSelect,
	selectOption,
} from '@drk/src/Components/DarkenginesSelect/DarkenginesSelect';
import { IDarkenginesAdminActions } from '@drk/src/Grid/IDarkenginesAdminActions';
import { IDarkenginesAdminProps } from '@drk/src/Grid/IDarkenginesAdminProps';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { Dictionary } from 'ts-essentials';

declare global {
	interface HTMLElementTagNameMap {
		'drk-administration-grid': AdministrationGrid;
	}
}

export interface IAdministrationGridProps {
	models: Dictionary<IEntityModel>;
}

@customElement('drk-administration-grid')
export class AdministrationGrid extends LitElement {
	@property({ type: Object })
	public adminProps: IDarkenginesAdminProps;
	public adminActions: IDarkenginesAdminActions;
	@property({ type: Object })
	public props: IAdministrationGridProps;
	@state()
	protected gridProps: IDarkenginesGridProps;

	public static styles?: CSSResultGroup = [
		css`
			#actions {
				display: grid;
				grid-auto-flow: column;
				grid-gap: var(--content-spacing);
				align-items: center;
			}
			#body {
				display: grid;
				grid-gap: var(--content-spacing);
				justify-items: start;
				padding: var(--content-padding);
			}
		`,
	];

	async update(changedProperties: PropertyValues) {
		super.update(changedProperties);
		if (changedProperties.has('adminProps')) {
			this.gridProps = this.adminProps?.grid ? await this.adminProps.grid : undefined;
		}
	}

	public render() {
		return html`<div id="body">${this.renderMenu()}${this.renderGrid()}</div>`;
	}
	public renderMenu() {
		return html`<div id="actions">
			<drk-select
				.selectedIndex=${this.adminProps?.models && this.adminProps?.model
					? this.adminProps.models.indexOf(this.adminProps.model)
					: -1}
				@input=${async (e: CustomEvent) => {
					const select = e.currentTarget as DarkenginesSelect;
					this.adminProps = await this.adminActions.setModel(
						this.adminProps,
						this.adminProps.models[select.selectedIndex]
					);
				}}
				quick
				id="selected-model"
				label="Item"
				.value=${this.adminProps?.model?.name}
			>
				${repeat(Object.values(this.adminProps?.models ?? []), (model) => {
					return selectOption(model.name);
				})}
			</drk-select>
			<drk-button
				@click=${async (e: MouseEvent) => {
					this.adminProps = await this.adminActions.add(this.adminProps);
				}}
				>Create
			</drk-button>
		</div>`;
	}
	public renderGrid() {
		if (!this.gridProps) return nothing;
		const actions: IDarkenginesGridActions = {
			setFilter: async (grid, filter) =>
				await this.adminActions.setFilter(grid, this.adminProps.model, filter),
			setOrder: async (grid, order) =>
				await this.adminActions.setOrder(grid, this.adminProps.model, order),
			setPagination: async (grid, pagination) =>
				await this.adminActions.setPagination(grid, this.adminProps.model, pagination),
			edit: async (item) => this.adminActions.edit(this.adminProps, item),
			delete: async (item) => {
				this.adminProps = { ...this.adminProps, deleteItem: item };
			},
		};
		return html` <drk-grid
			.darkenginesGridProps=${this.gridProps}
			.darkenginesGridActions=${actions}
		></drk-grid>`;
	}
}
