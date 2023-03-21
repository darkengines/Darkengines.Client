import mdcTypographyStyles from '!raw-loader!@material/typography/dist/mdc.typography.css';
import '@material/mwc-formfield';
import '@material/mwc-icon-button';
import '@material/mwc-ripple';
import { css, html, LitElement, nothing, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { IFieldFactoryContext } from '../../Components/DarkenginesForm/IFieldFactory';
import { DarkenginesGridAction } from '../../Components/DarkenginesGrid/DarkenginesGridAction';
import { IFilter } from '../../Components/DarkenginesGrid/IDarkenginesGrid';
import {
	DarkenginesSearchMenu,
	IDarkenginesSearchMenuProps,
} from '../../Components/DarkenginesSearchMenu/DarkenginesSearchMenu';
import { IFormProps, IFormActions } from '../../Components/Forms';
import { IColumn } from '../../Grid/IColumn';
import { IReferenceModel } from '../../Model/IReferenceModel';
import '../../../Common/Components/SearchMenu/SearchMenu';
import { IEditorComponentProps, IEditorComponentActions } from '../IComponentFactory';

export interface IReferenceEditorProps extends IEditorComponentProps<IReferenceModel, object> {
	columns: IColumn[];
	filter: IFilter;
	searchResults: any[];
	context: IFieldFactoryContext;
	form: {
		props: IFormProps;
		actions: IFormActions;
	};
}
export interface IReferenceEditorActions extends IEditorComponentActions<IReferenceModel, object> {
	filterChanged: (props: IReferenceEditorProps) => Promise<IReferenceEditorProps>;
	referenceFieldsRequested: (props: IReferenceEditorProps) => Promise<IReferenceEditorProps>;
	referenceChanged: (props: IReferenceEditorProps) => IReferenceEditorProps;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-reference-editor': ReferenceEditor;
	}
}
@customElement('drk-reference-editor')
export class ReferenceEditor extends LitElement {
@property({ type: Object })
	public props: IReferenceEditorProps;
	public actions: IReferenceEditorActions;
	@property({ attribute: false })
	public edit: boolean = false;
	@query('#new-menu')
	public newMenu: DarkenginesSearchMenu;
	@query('#reference')
	public referenceDiv: HTMLDivElement;
	@query('#filter-input')
	public filterInput: HTMLElement;

	public static get styles() {
		return [
			unsafeCSS(mdcTypographyStyles),
			css`
				:host {
					display: grid;
					grid-template-columns: 1fr;
					height: 100%;
					grid-template-rows: auto auto;
					grid-template-columns: auto;
				}
				* {
					box-sizing: border-box;
				}
				#label {
					display: block;
					background-color: var(--primary-color);
					color: var(--on-primary-color);
					padding: calc(var(--content-spacing) / 2) var(--content-spacing);
					position: sticky;
					top: 0;
					z-index: 2;
				}
				#value {
					padding: var(--content-spacing);
					display: grid;
					align-items: center;
					grid-template-columns: auto;
					grid-gap: var(--content-spacing);
					grid-auto-flow: row;
					border-left: var(--primary-color) 4px solid;
					border-right: var(--primary-color) 4px solid;
					border-bottom: var(--primary-color) 4px solid;
				}
				#head {
					display: grid;
					grid-template-rows: auto;
					grid-template-columns: auto auto;
					align-items: center;
					grid-gap: var(--content-spacing);
					position: relative;
				}
				#reference {
					position: relative;
					padding: var(--content-padding);
					border: var(--secondary-color) solid 2px;
					border-radius: 4px;
					cursor: pointer;
				}
				#filter {
					padding: 0px calc(var(--content-padding) / 2) calc(var(--content-padding) / 2)
						calc(var(--content-padding) / 2);
				}
				mwc-list-item {
					padding: var(--content-padding);
					--mdc-menu-item-height: auto;
				}
				#editor {
				}
			`,
		];
	}
	firstUpdated(_changedProperties: PropertyValues) {
		super.firstUpdated(_changedProperties);
		//this.menu.anchor = this.referenceDiv;
	}
	render() {
		let focusableElement: HTMLElement;
		//const item = this.state.model.componentFactories[0].display(this.state.value);
		return html`<label id="label" class="mdc-typography--body1">${this.props.model.name}</label>
			<div id="value">
				<div id="head">
					<div>
						<div
							id="reference"
							@click=${(e: Event) => {
								//this.menu.open = true;
								this.newMenu.menuSurface = {
									...this.newMenu.menuSurface,
									open: true,
								};
								this.newMenu.focus();
							}}
						>
							<mwc-ripple></mwc-ripple>
							${repeat(this.props.columns, (column) =>
								column.componentFactory.display(
									column.getComponentProps(
										{
											actions: DarkenginesGridAction.Edit,
											columns: {},
											data: [],
											filter: undefined,
											model: undefined,
											order: undefined,
											pagination: undefined,
										},
										this.props.value
									),
									undefined
								)
							) ?? 'NULL'}
						</div>
						<drk-search-menu
							id="new-menu"
							.props=${{}}
							.actions=${{
								onFocus: async (
									props: IDarkenginesSearchMenuProps,
									options: FocusOptions
								) => {
									focusableElement.focus();
								},
							}}
						>
							${repeat(this.props.searchResults, (searchResult) => {
								return html`<mwc-list-item
									@click=${(e: MouseEvent) => {
										if (searchResult && searchResult !== this.props.value) {
											this.actions.referenceChanged({
												...this.props,
												value: searchResult,
											});
											this.newMenu.menuSurface = {
												...this.newMenu.menuSurface,
												open: false,
											};
										}
									}}
									>${repeat(this.props.columns, (column) =>
										column.componentFactory.display(
											column.getComponentProps(
												{
													actions: DarkenginesGridAction.Edit,
													columns: {},
													data: [],
													filter: undefined,
													model: undefined,
													order: undefined,
													pagination: undefined,
												},
												searchResult
											),
											undefined
										)
									) ?? 'NULL'}</mwc-list-item
								>`;
							})}
							${repeat(this.props.columns, (column) => {
								const filter = column.getFilter(this.props.filter.args);
								return repeat(
									filter.operator.parameters,
									(parameter) => parameter.name,
									(parameter, index) => {
										const componentFactory =
											parameter.typeName == '*'
												? column.model.componentFactories[0]
												: parameter.componentFactories[0];
										return html`<div slot="filter">
											${componentFactory.filter(
												{
													...column.getComponentProps(
														{
															actions: DarkenginesGridAction.Edit,
															columns: {},
															data: [],
															filter: undefined,
															model: undefined,
															order: undefined,
															pagination: undefined,
														},
														this.props.value
													),
													model: {
														...column.model,
														isNullable: true,
													} as any,
													component: {
														label: undefined,

														id: 'filter-input',
													},
													value: filter.args,
												},
												{
													valueChanged: async (props) => {
														const result = column.setFilter(
															this.props.filter.args,
															{
																...filter,
																args: props.value,
															}
														);
														this.props =
															await this.actions.filterChanged({
																...this.props,
																filter: {
																	...this.props.filter,
																	args: result,
																},
															});
													},
												},
												(component) => {
													if (index == 0) focusableElement = component;
												}
											)}
										</div>`;
									}
								);
							})}
						</drk-search-menu>
					</div>
					<mwc-icon-button
						icon="edit"
						@click=${async (e) => {
							this.edit = !this.edit;
							if (this.edit && !this.props.form?.props?.fields) {
								this.props = await this.actions.referenceFieldsRequested(
									this.props
								);
							}
						}}
					></mwc-icon-button>
				</div>
				${this.edit ? this.renderForm() : nothing}
			</div>`;
	}

	renderForm() {
		return html`<div id="editor">
			<drk-admin-form
				.comeetAdminProps=${this.props.form.props}
				.comeetAdminActions=${this.props.form.actions}
			></drk-admin-form>
		</div>`;
	}
}
