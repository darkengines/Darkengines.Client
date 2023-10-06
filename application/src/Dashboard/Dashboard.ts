import commonCss from '!raw-loader!../Common/Common.css';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '@drk/src/Components/DarkenginesGrid/DarkenginesGrid';
import { IDarkenginesGridActions } from '@drk/src/Components/DarkenginesGrid/IDarkenginesGrid';
import '@drk/src/Components/DarkenginesSelect/DarkenginesSelect';
import { IDarkenginesAdminActions } from '@drk/src/Grid/IDarkenginesAdminActions';
import { IDarkenginesAdminProps } from '@drk/src/Grid/IDarkenginesAdminProps';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import {
	mdcButton,
	mdcElevation,
	mdcTextfield,
	mdcTypography,
} from '@drk/src/Styles/Material/index';
import { msg } from '@lit/localize';
import '@material/mwc-icon-button/mwc-icon-button.js';

import { css, html, LitElement, PropertyValueMap, svg, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { until } from 'lit/directives/until.js';
import { groupBy } from 'lodash';
import { Dictionary } from 'ts-essentials';
import logo from '../../assets/images/logo.svg';
import { lorem } from './lorem';
import '../Terminal/Components/Terminal/Terminal';

export interface IDashboardProps {
	models: Dictionary<IEntityModel>;
}
declare global {
	interface HTMLElementTagNameMap {
		'drk-dashboard': Dashboard;
	}
}
@customElement('drk-dashboard')
export class Dashboard extends LitElement {
	@property({ type: Object })
	public adminProps: IDarkenginesAdminProps;
	public adminActions: IDarkenginesAdminActions;
	public props: IDashboardProps;
	@query('.mdc-button')
	protected buttons: HTMLElement[];
	public static get styles() {
		return [
			unsafeCSS(commonCss),
			mdcElevation,
			mdcTextfield,
			mdcTypography,
			mdcButton,
			css`
				:host {
					max-height: 100%;
					height: 100%;
					display: block;
				}
				#selected-model {
					justify-self: start;
				}
			`,
		];
	}
	protected firstUpdated(
		_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
	): void {
		super.firstUpdated(_changedProperties);
	}
	render() {
		const models = groupBy(Object.values(this.props.models), (model) => model.namespace[1]);
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
			${until(this.renderGrid(), html`Loading...`)} <drk-terminal></drk-terminal> ${lorem}`;
	}
	async renderGrid() {
		const gridProps = await this.adminProps.grid;
		gridProps.model = this.adminProps.model;
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
		return html`<drk-grid
				style="height: 512px;"
				.darkenginesGridProps=${gridProps}
				.darkenginesGridActions=${actions}
			></drk-grid>
			<mwc-dialog ?open=${!!this.adminProps.deleteItem}>
				<div>
					${msg(
						html`Delete item
							<b
								>${this.adminProps.model.summaryProperties
									.map((property) => this.adminProps.deleteItem?.[property.name])
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
