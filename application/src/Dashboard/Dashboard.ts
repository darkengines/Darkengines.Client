import { css, CSSResultGroup, html, LitElement, PropertyValueMap, svg, unsafeCSS } from 'lit';
import { customElement, property, query, queryAll, state } from 'lit/decorators.js';
import { defaultHeader, form, signInFooter } from '../Common/Common';
import commonCss from '!raw-loader!../Common/Common.css';
import {
	mdcButton,
	mdcElevation,
	mdcTextfield,
	mdcTypography,
} from '@drk/src/Styles/Material/index';
import '@material/mwc-icon-button/mwc-icon-button.js';
import { repeat } from 'lit/directives/repeat.js';
import { schemaSample } from '@drk/src/schema_sample';
import { groupBy } from 'lodash';
import Schema from '@drk/src/Model/Schema';
import { IEntityModel } from '@drk/src/Model/IEntityModel';
import { Dictionary } from 'ts-essentials';
import { lorem } from './lorem';
import logo from '../../assets/images/logo.svg';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import '@material/web/ripple/ripple.js';
import '@material/web/button/text-button';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import '@drk/src/Components/DarkenginesSelect/DarkenginesSelect';
import { ripple } from '@material/web/ripple/directive';
import { MdRipple } from '@material/web/ripple/ripple.js';
import '@material/web/textfield/outlined-text-field';
import '@material/web/textfield/filled-text-field';
import { IDarkenginesGridActions } from '@drk/src/Components/DarkenginesGrid/IDarkenginesGrid';
import { IDarkenginesAdminProps } from '@drk/src/Grid/IDarkenginesAdminProps';
import { IDarkenginesAdminActions } from '@drk/src/Grid/IDarkenginesAdminActions';
import { msg } from '@lit/localize';
import { until } from 'lit/directives/until.js';
import '@drk/src/Components/DarkenginesGrid/DarkenginesGrid';

export interface IDashboardProps {
	models: Dictionary<IEntityModel>;
}

@customElement('drk-dashboard')
export class Dashboard extends LitElement {
	@property({ type: Object })
	public adminProps: IDarkenginesAdminProps;
	public adminActions: IDarkenginesAdminActions;
	public props: IDashboardProps;
	@query('.mdc-button')
	protected buttons: HTMLElement[];
	@state()
	protected state: {
		selectedModel?: IEntityModel;
	} = {
		selectedModel: undefined,
	};
	public static get styles() {
		return [
			unsafeCSS(commonCss),
			mdcElevation,
			mdcTextfield,
			mdcTypography,
			mdcButton,
			css`
				:host {
					display: block;
				}
				.application {
					display: grid;
					grid:
						'nav header' min-content
						'nav content' 1fr / auto 1fr;
				}
				#navbar {
					display: grid;
					grid-template:
						'header' auto
						'menu' 1fr;
					grid-area: nav;
					height: 100vh;
					position: sticky;
					top: 0;
				}
				#content {
					grid-area: content;
					position: relative;
				}
				#content main {
				}
				header {
					display: grid;
					grid-area: header;
					position: sticky;
					top: 0;
					grid-template: 'logo title' / auto 1fr;
					gap: var(--content-spacing);
					place-items: start;
					align-items: center;
					justify-items: start;
					z-index: 1;
					padding: calc(var(--content-padding) / 4) var(--content-padding);
				}
				header svg {
					grid-area: logo;
					height: 48px;
				}
				header .title {
					grid-area: title;
				}
				menu {
					grid-area: menu;
					display: grid;
					align-content: start;
					position: sticky;
					top: 0;
					max-height: 100vh;
				}
				.menu-item {
					--md-text-button-container-shape: 0px;
				}
				main {
					display: grid;
					background-color: var(--surface-background-color);
					justify-content: start;
					padding: var(--content-padding);
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
		return html`<div class="application">
			<div id="navbar" class="surface mdc-elevation--z1">
				<header surface mdc-elevation--z1>
					${svg`${unsafeSVG(logo)}`}
					<div class="title">Application</div>
				</header>
				<menu>
					${repeat(Object.keys(models), (modelKey) => {
						return html`<md-text-button
							class="menu-item"
							tabindex="0"
							label=${modelKey}
						>
						</md-text-button>`;
					})}
				</menu>
			</div>
			<header class="surface header mdc-elevation--z1">
				${svg`${unsafeSVG(logo)}`}
				<div class="title">Application</div>
			</header>
			<div id="content">
				<main>
					<drk-select outlined label="Item" .value=${this.state.selectedModel?.name}>
						${repeat(Object.values(this.props.models), (model) => {
							return html` <mwc-list-item
								.value=${model.name}
								@click=${(e: MouseEvent) => {
									this.state = {
										...this.state,
										selectedModel: model,
									};
								}}
								?selected=${model == this.state.selectedModel}
								>${model.name}</mwc-list-item
							>`;
						})}
					</drk-select>
					${until(this.renderGrid(), html`Loading...`)} ${lorem}
				</main>
			</div>
		</div>`;
	}
	async renderGrid() {
		const gridProps = await this.adminProps.darkenginesGrid;
		const actions: IDarkenginesGridActions = {
			setFilter: async (grid, filter) =>
				await this.adminActions.setFilter(grid, this.adminProps.selectedModel, filter),
			setOrder: async (grid, order) =>
				await this.adminActions.setOrder(grid, this.adminProps.selectedModel, order),
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
				.darkenginesGridProps=${gridProps}
				.darkenginesGridActions=${actions}
			></drk-grid>
			<mwc-dialog ?open=${!!this.adminProps.deleteItem}>
				<div>
					${msg(
						html`Delete item
							<b
								>${this.adminProps.selectedModel.summaryProperties
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
