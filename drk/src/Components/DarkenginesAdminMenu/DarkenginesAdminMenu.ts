import { msg } from '@lit/localize';
import { TextField } from '@material/mwc-textfield';
import convert from 'color-convert';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { IEntityModel } from '../../Model/IEntityModel';

export interface IDarkenginesAdminMenu {
	models: IEntityModel[];
	onRepositorySelected: (model: IEntityModel) => Promise<void>;
}

@customElement('drk-admin-menu')
export default class DarkenginesAdminMenu extends LitElement {
	public static get styles() {
		return css`
			:host {
				display: block;
				padding: var(--content-padding);
				overflow: auto;
				max-height: 100%;
				display: grid;
				grid-template-rows: auto 1fr;
				grid-gap: var(--content-spacing);
				justify-items: start;
			}
			#repositories {
				display: grid;
				grid-template-columns: repeat(auto-fill, 200px);
				grid-gap: var(--content-padding);
				place-items: center start;
				place-content: center start;
				justify-self: stretch;
			}
			.repository {
				width: 200px;
				height: 200px;
				border: 1px solid black;
				background-color: var(--accent-color);
				color: var(--on-primary);
				text-align: left;
				padding: var(--content-padding);
				box-sizing: border-box;
				overflow: hidden;
			}
		`;
	}
	@property({ type: Object })
	public comeetAdminMenu: IDarkenginesAdminMenu;
	@property({ type: String })
	public filter: string;
	render() {
		let index = 0;
		return html` <mwc-textfield
				outlined
				label="${msg('Search')}"
				@input=${(e: Event) => (this.filter = (e.currentTarget as TextField).value)}
			></mwc-textfield>
			<div id="repositories">
				${repeat(
					(
						(this.filter &&
							this.filter.length &&
							this.comeetAdminMenu.models.filter((model) =>
								model.displayName
									.toLowerCase()
									.startsWith(this.filter.toLowerCase())
							)) ||
						this.comeetAdminMenu.models
					).sort((left, right) => left.displayName.localeCompare(right.displayName)),
					(model) => model.name,
					(model) =>
						html`<div
							style="background-color: rgba(${convert.hsv
								.rgb([(index++ * 256 * 1.618033988749894) % 360, 100, 65])
								.join(',')}, 1)"
							class="repository"
							@click=${(e) => this.comeetAdminMenu.onRepositorySelected(model)}
						>
							${model.displayName}
						</div>`
				)}
			</div>`;
	}
}
