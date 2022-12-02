import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IComponentProps } from '../IComponentFactory';

@customElement('drk-date-time-display')
class DateTimeDisplay extends LitElement {
	@property({ type: Object })
	public props: IComponentProps<IPropertyModel, Date>;
	public static get styles() {
		return css`
			:host {
				display: block;
				text-align: right;
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
		return html`${this.props &&
		this.props.value &&
		new Date(this.props.value).toLocaleDateString()}`;
	}
}