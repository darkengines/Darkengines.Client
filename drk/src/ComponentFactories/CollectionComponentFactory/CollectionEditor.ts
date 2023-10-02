import mdcTypographyStyles from '!raw-loader!@material/typography/dist/mdc.typography.css';
import '@material/mwc-formfield';
import '@material/mwc-icon-button';
import '@material/mwc-ripple';
import { css, html, LitElement, nothing, PropertyValueMap, PropertyValues, unsafeCSS } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { IFieldFactoryContext } from '../../Components/DarkenginesForm/IFieldFactory';
import { DarkenginesGridAction } from '../../Components/DarkenginesGrid/DarkenginesGridAction';
import {
	IDarkenginesGridActions,
	IDarkenginesGridProps,
	IFilter,
} from '../../Components/DarkenginesGrid/IDarkenginesGrid';
import {
	DarkenginesSearchMenu,
	IDarkenginesSearchMenuProps,
} from '../../Components/DarkenginesSearchMenu/DarkenginesSearchMenu';
import { IFormProps, IFormActions } from '../../Components/Forms';
import { IColumn } from '../../Grid/IColumn';
import { ICollectionModel } from '../../Model/ICollectionModel';
import '../../Components/DarkenginesSearchMenu/DarkenginesSearchMenu';
import { IEditorComponentProps, IEditorComponentActions } from '../IComponentFactory';
import { until } from 'lit/directives/until.js';

export interface ICollectionEditorProps extends IEditorComponentProps<ICollectionModel, object> {
	grid: Promise<IDarkenginesGridProps>;
	searchResults: any[];
	context: IFieldFactoryContext;
	form: {
		props: IFormProps;
		actions: IFormActions;
	};
}
export interface ICollectionEditorActions
	extends IEditorComponentActions<ICollectionModel, object> {
	grid: IDarkenginesGridActions;
}

declare global {
	interface HTMLElementTagNameMap {
		'drk-collection-editor': CollectionEditor;
	}
}
@customElement('drk-collection-editor')
export class CollectionEditor extends LitElement {
	@property({ type: Object })
	public props: ICollectionEditorProps;
	public actions: ICollectionEditorActions;
	@state()
	protected grid: IDarkenginesGridProps;
	@property({ attribute: false })
	public edit: boolean = false;
	@query('#new-menu')
	public newMenu: DarkenginesSearchMenu;
	@query('#collection')
	public collectionDiv: HTMLDivElement;
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
				#collection {
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
		//this.menu.anchor = this.collectionDiv;
	}
	protected update(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		if (changedProperties.has('props')) {
			if (this.props.grid) {
				(async () => {
					this.grid = await this.props.grid;
				})();
			}
		}
		super.update(changedProperties);
	}
	render() {
		let focusableElement: HTMLElement;
		//const item = this.state.model.componentFactories[0].display(this.state.value);
		return html`<label id="label" class="mdc-typography--body1">${this.props.model.name}</label>
			${this.renderGrid()}`;
	}
	renderGrid() {
		if (!this.grid) return nothing;
		return html`<drk-grid
			.darkenginesGridProps=${this.grid}
			.darkenginesGridActions=${this.actions.grid}
		></drk-grid>`;
	}
	renderForm() {
		return nothing;
		// return html`<div id="editor">
		// 	<drk-admin-form
		// 		.comeetAdminProps=${this.props.form}
		// 		.comeetAdminActions=${this.actions.form}
		// 	></drk-admin-form>
		// </div>`;
	}
}
