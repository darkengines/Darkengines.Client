import mdcTypographyCss from '!raw-loader!@material/typography/dist/mdc.typography.css';
import '@material/mwc-icon';
import '@material/mwc-icon-button';
import { IconButton } from '@material/mwc-icon-button';
import { SelectedDetail } from '@material/mwc-list';
import { Menu } from '@material/mwc-menu';
import '@material/mwc-select';
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
				#grid-layout-wrapper {
					border: 1px solid rgba(0, 0, 0, 0.38);
					transform: translateZ(0px);
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
				}
				#head {
					position: sticky;
					top: 0px;
					cursor: pointer;
					z-index: 2;
					box-shadow: rgb(0 0 0 / 38%) 0px 0px 4px 0px;
					background-color: white;
				}
				#body {
					z-index: 1;
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
				}

				.column {
					border-right: 1px solid rgba(0, 0, 0, 0.38);
					display: grid;
					grid-auto-flow: row;
					grid-auto-rows: auto;
					grid-template-columns: auto;
					align-content: start;
					justify-items: start;
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
					background-color: var(--background-color);
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
		if (
			!this.layout &&
			this.darkenginesGridProps?.columns &&
			this.darkenginesGridProps?.data.length
		) {
			await this.updateComplete;
			setTimeout(async () => {
				await new Promise((resolve) => requestAnimationFrame(resolve));
				await this.applyLayout();
			}, 0);
		}
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
		return html` ${this.renderLayoutStyles()}
			<div id="grid-layout-wrapper">
				<div id="grid-layout-scroller">
					<div>
						<div id="head" class="grid">
							${repeat(
								columns,
								(column) => column.name,
								(column, index) => {
									const filter = column.getFilter(
										this.darkenginesGridProps.filter.args
									);
									let filterMenu: Menu;
									let filterMenuButton: IconButton;
									return html`<div
										class=${classMap({
											column: true,
											last: index == columns.length - 1,
										})}
									>
										<div
											class="cell title mdc-typography--body1"
											@click=${(e: Event) => this.onOrder(column)}
										>
											<mwc-ripple></mwc-ripple>
											${column.displayName}
											<span class="order">
												${this.darkenginesGridProps.order[column.name]
													?.order > 0
													? '▲'
													: this.darkenginesGridProps.order[column.name]
															?.order < 0
													? '▼'
													: nothing}
											</span>
										</div>
										<div class="cell filter">
											<mwc-icon-button
												${ref((e) => {
													if (e) {
														filterMenuButton = e as IconButton;
														if (filterMenu) {
															//filterMenu.anchor = filterMenuButton;
															// filterMenu.x =
															// 	e?.getBoundingClientRect()?.x;
															// filterMenu.y =
															// 	e?.getBoundingClientRect()?.y;
														}
													}
												})}
												icon="filter_alt"
												@click=${(e: Event) => {
													const menu = (
														e.currentTarget as HTMLElement
													).parentElement.querySelector(
														'mwc-menu'
													) as Menu;
													menu.open = !menu.open;
												}}
											></mwc-icon-button>
											<mwc-menu
												quick
												${ref((e: Menu) => {
													if (e) {
														filterMenu = e;
														if (filterMenuButton) {
															//filterMenu.anchor = filterMenuButton;
															//filterMenu.x =
															//	filterMenuButton.getBoundingClientRect()?.x;
															//filterMenu.y =
															//		filterMenuButton?.getBoundingClientRect()?.y;
														}
													}
												})}
											>
												<mwc-list
													activatable
													@selected=${async (
														e: CustomEvent<SelectedDetail>
													) => {
														const newSelectedOperator =
															column.operators[
																e.detail.index as number
															];
														if (
															newSelectedOperator &&
															filter.operator != newSelectedOperator
														) {
															this.darkenginesGridProps =
																await this.darkenginesGridActions.setFilter(
																	this.darkenginesGridProps,
																	column.setFilter(
																		this.darkenginesGridProps
																			.filter.args,
																		{
																			...filter,
																			operator:
																				newSelectedOperator,
																		}
																	)
																);
															filterMenu.close();
														}
													}}
												>
													${repeat(
														column.operators,
														(operator) => operator.name,
														(operator) => {
															return html`<mwc-list-item
																?selected=${filter.operator ==
																operator}
																?activated=${filter.operator ==
																operator}
																>${operator.shortDisplayName}</mwc-list-item
															>`;
														}
													)}
												</mwc-list>
											</mwc-menu>

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
																			this
																				.darkenginesGridProps
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
							<div class="column actions">
								<div class="cell mdc-typography--body1">${msg('Actions')}</div>
								<div class="cell mdc-typography--body1"></div>
							</div>
						</div>
						<div id="body" class="grid">
							${repeat(
								columns,
								(column) => column.name,
								(column, index) => {
									return html`<div
										class=${classMap({
											column: true,
											last: index == columns.length - 1,
										})}
									>
										${repeat(
											this.darkenginesGridProps.data,
											(item) =>
												this.darkenginesGridProps.model.primaryKey
													.map((pk) => item[pk.name])
													.join(','),
											(item) => html`<div class="cell mdc-typography--body2">
												${column.componentFactory.display(
													column.getComponentProps(
														this.darkenginesGridProps,
														item
													),
													{}
												)}
											</div>`
										)}
									</div>`;
								}
							)}
							<div class="column actions">
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
						</div>
					</div>
				</div>
			</div>
			<div id="pagination" class="mdc-typography--body1">${this.renderPagination()}</div>`;
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
