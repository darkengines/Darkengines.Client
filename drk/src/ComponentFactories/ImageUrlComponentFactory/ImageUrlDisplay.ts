import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IComponentProps } from '../IComponentFactory';

@customElement('drk-image-url-display')
class ImageUrlDisplay extends LitElement {
	@property({ type: Object })
	public props: IComponentProps<IPropertyModel, string>;
	public static get styles() {
		return css`
			:host {
				display: block;
				max-width: 100%;
				max-height: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			img {
				max-width: 100%;
				max-height: 64px;
			}
			.null {
				color: grey;
			}
		`;
	}
	renderNull() {
		return html`<span class="null">NULL</span>`;
	}
	render() {
		if (this.props.value === undefined || this.props.value === null) return this.renderNull();
		return this.props.value
			? html`<img src="${this.props.value}" />`
			: html`<mwc-icon>image_not_supported</mwc-icon>`;
	}
}