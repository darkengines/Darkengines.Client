import { IDarkenginesGridActions } from '@drk/src/Components/DarkenginesGrid/IDarkenginesGrid';
import { IDarkenginesAdminActions } from '@drk/src/Grid/IDarkenginesAdminActions';
import { IDarkenginesAdminProps } from '@drk/src/Grid/IDarkenginesAdminProps';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
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
	public render() {
		return html`${until(this.renderGrid(), html`Loading...`)}`;
	}
	public async renderGrid() {
		const gridProps = await this.adminProps.darkenginesGrid;
		const actions: IDarkenginesGridActions = {
			setFilter: async (grid, filter) =>
				await this.adminActions.setFilter(grid, this.adminProps.model, filter),
			setOrder: async (grid, order) =>
				await this.adminActions.setOrder(grid, this.adminProps.model, order),
			setPagination: async (grid, pagination) =>
				await this.adminActions.setPagination(grid, this.adminProps.model, pagination),
			edit: async (item) => this.adminActions.edit(item),
			delete: async (item) => {
				this.adminProps = { ...this.adminProps, deleteItem: item };
			},
		};
		return html`<drk-select
				outlined
				id="selected-model"
				label="Item"
				.value=${this.adminProps.model?.name}
			>
				${repeat(Object.values(this.props.models), (model) => {
					return html` <mwc-list-item
						.value=${this.adminProps.model.name}
						@click=${async (e: MouseEvent) => {
							this.adminProps = await this.adminActions.setModel(
								this.adminProps,
								model
							);
						}}
						?selected=${model == this.adminProps.model}
						>${model.name}</mwc-list-item
					>`;
				})}
			</drk-select>
			<drk-grid
				style="height: 512px;"
				.darkenginesGridProps=${gridProps}
				.darkenginesGridActions=${actions}
			></drk-grid>`;
	}
}
