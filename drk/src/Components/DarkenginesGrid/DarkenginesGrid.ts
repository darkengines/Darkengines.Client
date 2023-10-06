import mdcTypographyCss from '!raw-loader!@material/typography/dist/mdc.typography.css';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import { IconButton } from '@material/mwc-icon-button';
import '@material/mwc-select';
import { MdMenu, MenuItem } from '@material/web/menu/menu';

import { css, html, LitElement, nothing, PropertyValues, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';
import { property } from 'lit/decorators/property.js';
import { query } from 'lit/decorators/query.js';
import { classMap } from 'lit/directives/class-map.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { IColumn } from '../../Grid/IColumn';
import { IDarkenginesGridActions, IDarkenginesGridProps, Order } from './IDarkenginesGrid';
import IDarkenginesGridLayout from './IDarkenginesGridLayout';
//import { scrollbarStyle } from '../../Theme/scrollbar';
import { msg } from '@lit/localize';
import gifUrl from '../../../../application/assets/images/dmet32.gif';

declare global {
	interface HTMLElementTagNameMap {
		'drk-grid': DarkenginesGrid;
	}
}
@customElement('drk-grid')
export class DarkenginesGrid extends LitElement {
	@property({ attribute: false })
	public darkenginesGridProps: IDarkenginesGridProps;
	public darkenginesGridActions: IDarkenginesGridActions;
	@property({ type: Object })
	public layout: IDarkenginesGridLayout;
	@query('#grid-layout-scroller')
	protected gridLayoutScroller: HTMLDivElement;
	@query('#head')
	protected head: HTMLDivElement;
	@query('#body')
	protected body: HTMLDivElement;
	public static get styles() {
		return [
			//scrollbarStyle,
			unsafeCSS(mdcTypographyCss),
			css`
				* {
					box-sizing: border-box;
					-webkit-tap-highlight-color: transparent;
				}
				:host {
					display: grid;
					grid-template-rows: 1fr auto;
					grid-gap: 8px;
					justify-items: start;
					max-height: 100%;
					--scrollbar-size: 16px;
					--firefox-scrollbar-width: auto;
				}
				.cell.data-placeholder {
					font-size: xx-large;
					height: 256px;
					opacity: 0.66;
					text-align: left;
					padding: calc(var(--content-padding) * 4);
				}
				#grid-layout-wrapper {
					border: 1px solid rgba(0, 0, 0, 0.38);
					width: auto;
					height: 100%;
					max-height: 100%;
					max-width: 100%;
					min-height: 0px;
					min-width: 0px;
					display: inline-block;
					opacity: 1;
					font-size: 0px;
				}
				#grid-layout-scroller {
					display: grid;
					grid-template-rows: auto 1fr;
					overflow-y: scroll;
					overflow-x: auto;
					max-height: 100%;
					max-width: 100%;
					min-height: 100%;
					background-color: var(--background-color);
				}
				#head {
					position: sticky;
					top: 0px;
					cursor: pointer;
					z-index: 2;
					box-shadow: rgb(0 0 0 / 38%) 0px 0px 4px 0px;
					background-color: var(--surface-background-color);
				}
				#body {
					z-index: 1;
					background-color: var(--surface-background-color);
				}
				#body .column:not(.actions) .cell:nth-child(2n) {
					background-color: rgb(245 245 250);
				}
				#grid-layout {
					display: inline-block;
				}
				.grid {
					display: grid;
					grid-template-rows: 1fr;
					grid-auto-flow: column;
					grid-auto-columns: auto;
					justify-content: start;
					grid-template-columns: subgrid;
					grid-template-rows: subgrid;
				}

				.column {
					border-right: 1px solid rgba(0, 0, 0, 0.38);
					display: grid;
					grid-auto-flow: row;
					grid-auto-rows: auto;
					grid-template-columns: auto;
					align-content: start;
					justify-items: start;
					grid-template-rows: subgrid;
				}
				.column:last-child {
					border-right: none;
				}
				#body .column:not(.actions) {
					min-width: 0px;
					overflow: hidden;
				}
				.column.last {
					border-right: none;
				}
				.column.actions {
					position: sticky;
					right: 0px;
					cursor: pointer;
					background-color: var(--surface-background-color);
					border-left: 1px solid rgba(0, 0, 0, 0.38);
					box-shadow: rgb(0 0 0 / 38%) 0px 0px 4px 0px;
				}
				.cell {
					border-bottom: 1px solid rgba(0, 0, 0, 0.38);
					padding: 4px 8px;
					text-align: right;
					text-overflow: ellipsis;
					white-space: nowrap;
					box-sizing: border-box;
					position: relative;
					-webkit-tap-highlight-color: rgba(255, 255, 255, 0);
					max-width: 100%;
					width: 100%;
				}
				.cell:last-child {
					border-bottom: none;
				}
				#head .cell {
					text-align: left;
				}
				#head .cell.title {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				#head .cell.filter {
					display: grid;
					grid-auto-flow: column;
					align-items: center;
					justify-content: start;
					position: relative;
				}
				#body .column:not(.actions) .cell {
					min-width: 0px;
				}
				.order {
					display: inline-block;
					width: 24px;
					height: 24px;
					vertical-align: middle;
					text-align: right;
				}
				#pagination {
					display: grid;
					grid-auto-flow: column;
					grid-template-rows: 1fr;
					max-height: 100%;
					gap: 16px;
					align-items: end;
				}
				.page {
					border: 1px solid rgba(0, 0, 0, 0.38);
					padding: 4px 8px;
					cursor: pointer;
				}
				.page.active {
					color: var(--primary-color);
					border-color: var(--primary-color);
				}
			`,
		];
	}
	async update(changedProperties: PropertyValues) {
		if (changedProperties.has('darkenginesGridProps')) {
			const oldDarkenginesGrid = changedProperties.get(
				'darkenginesGridProps'
			) as IDarkenginesGridProps;
			if (
				oldDarkenginesGrid &&
				oldDarkenginesGrid.columns !== this.darkenginesGridProps.columns
			) {
				this.layout = undefined;
				//this.darkenginesGrid.data = [];
			}
		}
		super.update(changedProperties);
	}
	async updated(_changedProperties: PropertyValues) {
		super.updated(_changedProperties);
		// if (
		// 	!this.layout &&
		// 	this.darkenginesGridProps?.columns &&
		// 	this.darkenginesGridProps?.data.length
		// ) {
		// 	await this.updateComplete;
		// 	setTimeout(async () => {
		// 		await new Promise((resolve) => requestAnimationFrame(resolve));
		// 		await this.applyLayout();
		// 	}, 0);
		// }
	}

	async applyLayout() {
		const columnsLayout = this.getColumnsLayout();
		const rowsLayout = this.getRowsLayout();
		this.layout = {
			headRowsLayout: rowsLayout.headRowsLayout,
			bodyRowsLayout: rowsLayout.bodyRowsLayout,
			columnsLayout,
			layoutWidth: undefined,
		};
	}
	protected getColumnsLayout() {
		return Array.from(this.head.children).map((cell, cellIndex) =>
			Math.max(
				cell.getBoundingClientRect().width,
				Math.min(this.body.children[cellIndex].getBoundingClientRect().width, 256)
			)
		);
	}
	protected getRowsLayout() {
		const headColumns = Array.from(this.head.children);
		const bodyColumns = Array.from(this.body.children);
		const headRowsLayout = Array.from(Array(headColumns[0].children.length).keys())
			.map((rowIndex) =>
				headColumns.map(
					(column) =>
						(column.children[rowIndex] as HTMLDivElement).getBoundingClientRect().height
				)
			)
			.map((row) => row.reduce((rowHeight, cellHeight) => Math.max(rowHeight, cellHeight)));

		const bodyRowsLayout = Array.from(this.darkenginesGridProps.data.keys())
			.map((rowIndex) =>
				bodyColumns.map(
					(column) =>
						(column.children[rowIndex] as HTMLDivElement).getBoundingClientRect().height
				)
			)
			.map((row) => row.reduce((rowHeight, cellHeight) => Math.max(rowHeight, cellHeight)));

		return {
			headRowsLayout,
			bodyRowsLayout,
		};
	}
	protected async onOrder(column: IColumn) {
		const columnOrder = this.darkenginesGridProps.order[column.name];
		const newOrder = columnOrder?.order ? -columnOrder?.order : Order.Descendent;
		this.darkenginesGridProps = await this.darkenginesGridActions.setOrder(
			this.darkenginesGridProps,
			{
				...this.darkenginesGridProps.order,
				...Object.keys(this.darkenginesGridProps.order)
					.map((columnName) => {
						const previousOrder = this.darkenginesGridProps.order[columnName];
						return {
							...previousOrder,
							index: previousOrder.index + 1,
							columnName,
						};
					})
					.toDictionary((column) => column.columnName),
				[column.name]: {
					index: 0,
					order: newOrder,
				},
			}
		);
	}
	renderLayoutStyles() {
		//return nothing;
		if (this.layout) {
			return html`<style>
				#grid-layout-wrapper {
					opacity: 1 !important;
				}
				.grid {
					grid-template-columns: ${this.layout.columnsLayout
					.map((height) => `minmax(${height}px, min-content)`)
					.join(' ')} !important;
				}
				#head .column {
					grid-template-rows: ${this.layout.headRowsLayout
					.map((row) => `${row}px`)
					.join(' ')} !important;
				}
				#body .column {
					grid-template-rows: ${this.darkenginesGridProps.data
					.filter((item, index) => this.layout.bodyRowsLayout[index])
					.map((item, rowIndex) => `${this.layout.bodyRowsLayout[rowIndex]}px`)
					.join(' ')} !important;
				}
				#body .column:not(.actions) .cell {
					overflow: hidden !important;
				}
				${this.layout.layoutWidth
					? css`
							#grid-layout-scroller {
								width: ${this.layout.layoutWidth}px !important;
							}
					  `
					: nothing}
			</style>`;
		}
		return nothing;
	}
	render() {
		if (!this.darkenginesGridProps) return nothing;
		const columns = Object.values(this.darkenginesGridProps.columns) as IColumn[];
		const layoutStyle = `
			grid-template-columns:${Object.entries(this.darkenginesGridProps.columns).length}fr;
			grid-template-rows: auto auto ${this.darkenginesGridProps.data?.length || 1}fr
		`;
		const gridStyle = `
			grid-column:${Object.entries(this.darkenginesGridProps.columns).length + 1} span;
		`;
		return html` ${this.renderLayoutStyles()}
			<div id="grid-layout-wrapper">
				<div
					id="grid-layout-scroller"
					style="${layoutStyle}; grid-row: ${2 + this.darkenginesGridProps.data?.length ??
					0} span"
				>
					<div id="head" class="grid" style="${gridStyle}; grid-row: 2 span">
						${repeat(
							columns,
							(column) => column.name,
							(column, index) => {
								const filter = column.getFilter(
									this.darkenginesGridProps.filter.args
								);
								let filterMenu: MdMenu;
								let filterMenuButton: IconButton;
								let menuClosing = false;
								return html`<div
									class=${classMap({
										column: true,
										last: index == columns.length - 1,
									})}
									style="grid-row: 2 span"
								>
									<div
										class="cell title mdc-typography--body1"
										@click=${(e: Event) => this.onOrder(column)}
									>
										<mwc-ripple></mwc-ripple>
										${column.displayName}
										<span class="order">
											${this.darkenginesGridProps.order[column.name]?.order >
											0
												? '▲'
												: this.darkenginesGridProps.order[column.name]
														?.order < 0
												? '▼'
												: nothing}
										</span>
									</div>
									<div class="cell filter">
										<div>
											<mwc-icon-button
												icon="filter_alt"
												@click=${(e: Event) => {
													const menu = (
														e.currentTarget as HTMLElement
													).parentElement.querySelector(
														'md-menu'
													) as MdMenu;
													if (!menuClosing) menu.open = !menu.open;
												}}
											></mwc-icon-button>
											<md-menu
												positioning="fixed"
												quick
												${ref((e: MdMenu) => {
													if (e) {
														e.anchorElement =
															e.previousElementSibling as HTMLElement;
														filterMenu = e;
													}
												})}
												@closing=${(e) => {
													menuClosing = true;
												}}
												@closed=${(e) => {
													menuClosing = false;
												}}
											>
												${repeat(
													column.operators,
													(operator) => operator.name,
													(operator) => {
														return html`<md-menu-item
															@click=${async (e: MouseEvent) => {
																if (filter.operator != operator) {
																	this.darkenginesGridProps =
																		await this.darkenginesGridActions.setFilter(
																			this
																				.darkenginesGridProps,
																			column.setFilter(
																				this
																					.darkenginesGridProps
																					.filter.args,
																				{
																					...filter,
																					operator,
																				}
																			)
																		);
																	filterMenu.close();
																}
															}}
															?active=${filter.operator == operator}
														>
															<div slot="headline">
																${operator.shortDisplayName}
															</div>
														</md-menu-item> `;
													}
												)}
											</md-menu>
										</div>
										${repeat(
											filter.operator.parameters,
											(parameter: any) => parameter.name,
											(parameter: any) => {
												const componentFactory =
													parameter.typeName == '*'
														? column.model.componentFactories[0]
														: parameter.componentFactories[0];
												return componentFactory.filter(
													{
														model: {
															...column.model,
															isNullable: true,
														} as any,
														component: {
															label: undefined,
														},
														value: filter.args,
													},
													{
														valueChanged: async (editorProps) => {
															this.darkenginesGridProps =
																await this.darkenginesGridActions.setFilter(
																	this.darkenginesGridProps,
																	column.setFilter(
																		this.darkenginesGridProps
																			.filter.args,
																		{
																			...filter,
																			args: editorProps.value,
																		}
																	)
																);
															//column.onOperatorArgumentChanged(value);
														},
													}
												);
											}
										)}
									</div>
								</div>`;
							}
						)}
						<div class="column actions" style="grid-row: 2 span">
							<div class="cell mdc-typography--body1">${msg('Actions')}</div>
							<div class="cell mdc-typography--body1"></div>
						</div>
					</div>
					<div
						id="body"
						class="grid"
						style="${gridStyle}; grid-row: ${this.darkenginesGridProps.data?.length ||
						1} span"
					>
						${this.renderData(columns)}
					</div>
				</div>
			</div>
			<div id="pagination" class="mdc-typography--body1">${this.renderPagination()}</div>`;
	}

	protected renderDataPlaceholder(columns: IColumn[]) {
		return html`
			<div
				class="cell data-placeholder"
				style="grid-column:${Object.entries(columns).length || 1} span"
			>
				<img src="${gifUrl}" /> No data
			</div>
		`;
	}

	protected renderData(columns: IColumn[]) {
		if (this.darkenginesGridProps.data?.length < 1) return this.renderDataPlaceholder(columns);
		return html`
			${repeat(
				columns,
				(column) => column.name,
				(column, index) => {
					return html`<div
						class=${classMap({
							column: true,
							last: index == columns.length - 1,
						})}
						style="grid-row: ${this.darkenginesGridProps.data?.length || 1} span"
					>
						${repeat(
							this.darkenginesGridProps.data,
							(item) =>
								this.darkenginesGridProps.model.primaryKey
									.map((pk) => item[pk.name])
									.join(','),
							(item) => html`<div class="cell mdc-typography--body2">
								${column.componentFactory.display(
									column.getComponentProps(this.darkenginesGridProps, item),
									{}
								)}
							</div>`
						)}
					</div>`;
				}
			)}
			<div
				class="column actions"
				style="grid-row: ${this.darkenginesGridProps.data?.length || 1} span"
			>
				${repeat(
					this.darkenginesGridProps.data,
					(item) => html`<div class="cell mdc-typography--body2">
						<mwc-icon-button
							icon="edit"
							@click=${async (e: Event) => {
								await this.darkenginesGridActions.edit(item);
							}}
						></mwc-icon-button>
						<mwc-icon-button
							icon="delete"
							@click=${async (e: Event) => {
								await this.darkenginesGridActions.delete(item);
							}}
						></mwc-icon-button>
					</div>`
				)}
			</div>
		`;
	}

	protected renderPagination() {
		if (this.darkenginesGridProps.pagination.pageCount) {
			const range = Array.from(Array(this.darkenginesGridProps.pagination.pageCount).keys());
			const pages = range
				.map(
					(index) =>
						index === 0 ||
						index === this.darkenginesGridProps.pagination.pageCount - 1 ||
						Math.abs(index - this.darkenginesGridProps.pagination.pageIndex) < 4
				)
				.reduce((result, showPage, pageIndex, data) => {
					if (!showPage && !data[pageIndex - 1]) return result;
					if (!showPage) return [...result, html`...`];
					return [
						...result,
						html`<div
							@click=${async (e: Event) =>
								(this.darkenginesGridProps =
									await this.darkenginesGridActions.setPagination(
										this.darkenginesGridProps,
										{
											...this.darkenginesGridProps.pagination,
											pageIndex,
										}
									))}
							class=${classMap({
								active: pageIndex == this.darkenginesGridProps.pagination.pageIndex,
								page: true,
							})}
						>
							${pageIndex + 1}
						</div>`,
					];
				}, []);
			return pages;
		} else return nothing;
	}
}
