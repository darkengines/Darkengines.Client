import { msg } from '@lit/localize';
import '@material/mwc-button/mwc-button';
import '@material/mwc-dialog/mwc-dialog';
import { SelectedDetail } from '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import { css, html, LitElement } from 'lit';
import { property, query } from 'lit/decorators.js';
import { customElement } from 'lit/decorators/custom-element.js';
import { repeat } from 'lit/directives/repeat.js';
import { until } from 'lit/directives/until.js';
import { IDarkenginesAdminActions } from '../../Grid/IDarkenginesAdminActions';
import { IDarkenginesAdminProps } from '../../Grid/IDarkenginesAdminProps';
import '../../Data/StringExtensions';
import DarkenginesGrid from '../DarkenginesGrid/DarkenginesGrid';
import {
	IDarkenginesGridActions
} from '../DarkenginesGrid/IDarkenginesGrid';

@customElement('drk-admin')
export default class DarkenginesAdmin extends LitElement {
	@property({ type: Object })
	public adminProps: IDarkenginesAdminProps;
	public adminActions: IDarkenginesAdminActions;

	protected insertValue(value: unknown) {
		return JSON.stringify(value);
	}

	@query('drk-grid')
	protected comeetGrid: DarkenginesGrid;
	public static get styles() {
		return css`
			:host {
				display: grid;
				grid-template-columns: 1fr;
				grid-template-rows: auto 1fr;
				grid-gap: var(--content-spacing);
				padding: var(--content-padding);
				box-sizing: border-box;
				max-height: 100%;
				justify-items: start;
			}
			drk-grid {
				max-height: 100%;
				min-height: 0px;
				max-width: 100%;
				min-width: 0px;
				height: 100%;
			}
			#header {
				display: grid;
				grid-gap: var(--content-spacing);
				align-items: center;
				justify-items: start;
				grid-auto-flow: column;
			}

			#header #modelSelect {
			}

			#header #addButton {
			}
		`;
	}
	render() {
		return html`<div id="header">
				<mwc-select
					id="modelSelect"
					outlined
					label="{Model}"
					@selected=${async (e: CustomEvent<SelectedDetail<number>>) => {
						const repository = this.adminProps.models[e.detail.index];
						if (repository && repository !== this.adminProps.selectedModel) {
							const comeetAdminProps =
								await this.adminActions.setSelectedModel(
									this.adminProps,
									repository
								);
							if (comeetAdminProps) this.adminProps = comeetAdminProps;
						}
					}}
				>
					${repeat(
						this.adminProps.models,
						(model) => model.name,
						(model) => html`
							<mwc-list-item
								value=${model.name}
								?selected=${this.adminProps.selectedModel === model}
								>${model.displayName}</mwc-list-item
							>
						`
					)}
				</mwc-select>
				<mwc-button
					id="addButton"
					@click=${(e: MouseEvent) => this.adminActions.add(this.adminProps)}
					>${msg('Add')}</mwc-button
				>
			</div>
			${until(this.renderGrid(), 'Loading...')} `;
	}

	async renderGrid() {
		const gridProps = await this.adminProps.comeetGrid;
		const actions: IDarkenginesGridActions = {
			setFilter: async (grid, filter) =>
				await this.adminActions.setFilter(
					grid,
					this.adminProps.selectedModel,
					filter
				),
			setOrder: async (grid, order) =>
				await this.adminActions.setOrder(
					grid,
					this.adminProps.selectedModel,
					order
				),
			setPagination: async (grid, pagination) =>
				await this.adminActions.setPagination(
					grid,
					this.adminProps.selectedModel,
					pagination
				),
			edit: async (item) => this.adminActions.edit(item),
			delete: async (item) => {
				this.adminProps = { ...this.adminProps, deleteItem: item };
			},
		};
		return html`<drk-grid
				.comeetGridProps=${gridProps}
				.comeetGridActions=${actions}
			></drk-grid>
			<mwc-dialog ?open=${!!this.adminProps.deleteItem}>
				<div>
					${msg(
						html`Delete item
							<b
								>${this.adminProps.selectedModel.summaryProperties
									.map(
										(property) =>
											this.adminProps.deleteItem?.[property.name]
									)
									.join(',')}</b
							>?`,
						{ id: 'Admin.deleteMessage' }
					)}
				</div>
				<mwc-button
					slot="primaryAction"
					dialogAction="discard"
					@click="${async (e: MouseEvent) => {
						this.adminProps = {
							...(await this.adminActions.delete(this.adminProps)),
							deleteItem: undefined,
						};
					}}"
					>${msg('Delete')}</mwc-button
				>
				<mwc-button
					slot="secondaryAction"
					dialogAction="cancel"
					@click=${(e: MouseEvent) =>
						(this.adminProps = {
							...this.adminProps,
							deleteItem: undefined,
						})}
					>${msg('Cancel')}</mwc-button
				>
			</mwc-dialog>`;
	}
}
