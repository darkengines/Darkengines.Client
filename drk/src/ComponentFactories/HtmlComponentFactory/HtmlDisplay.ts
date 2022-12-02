import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IComponentProps } from '../IComponentFactory';

@customElement('drk-html-display')
class HtmlDisplay extends LitElement {
	@property({ type: Object })
	public props: IComponentProps<IPropertyModel, string>;
	public static get styles() {
		return css`
			:host {
				display: block;
				text-align: left;
				text-overflow: ellipsis;
				max-width: 100%;
				overflow: hidden;
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
		return html`${this.props.value}`;
	}
}