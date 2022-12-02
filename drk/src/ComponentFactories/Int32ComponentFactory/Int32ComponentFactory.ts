import { TextField } from '@material/mwc-textfield';
import { injectable } from 'inversify';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import {
	ComponentFactory, IComponentActions, IComponentProps, IEditorComponentActions, IEditorComponentProps
} from '../IComponentFactory';

@injectable()
export class Int32ComponentFactory implements ComponentFactory<IPropertyModel, number> {
	display(props: IComponentProps<IPropertyModel, number>, actions: IComponentActions) {
		return html`<drk-int-display .props=${props}></drk-int-display>`;
	}
	edit(
		props: IEditorComponentProps<IPropertyModel, number>,
		actions: IEditorComponentActions<IPropertyModel, number>
	) {
		return html`<drk-int-editor .props=${props} .actions=${actions}></drk-int-editor>`;
	}
	filter(
		props: IEditorComponentProps<IPropertyModel, number>,
		actions: IEditorComponentActions<IPropertyModel, number>,
		component: (component: IntEditor) => void
	) {
		return this.edit(props, actions);
	}
	canHandle(model: IPropertyModel) {
		return (model.displayTypeName ?? model.typeName) == 'Int';
	}
}

@customElement('drk-int-display')
class IntDisplay extends LitElement {
	@property({ type: Object })
	public props: IComponentProps<IPropertyModel, number>;
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
		return html`<div class="number">${this.props.value}</div>`;
	}
}

@customElement('drk-int-editor')
class IntEditor extends LitElement {
	@property({ type: Object })
	public props: IEditorComponentProps<IPropertyModel, number>;
	public actions: IEditorComponentActions<IPropertyModel, number>;
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
	render() {
		return html`<mwc-textfield
			endAligned
			style="min-width: 64px;"
			outlined
			?required=${!this.props.model.isNullable}
			.label=${this.props.model.name}
			placeholder="#${this.props.model.name}"
			.value=${this.props.value.toString() ?? ''}
			type="number"
			step="1"
			${ref((element) => {
				if (element && this.props.component) {
					Object.keys(this.props.component).forEach(
						(key) => (element[key] = this.props.component[key])
					);
				}
			})}
			@input=${(e: Event) => {
				let value = (e.currentTarget as TextField).value;
				if (!value.trim().length) value = undefined;
				this.actions.valueChanged?.({ ...this.props, value: Number.parseInt(value) });
			}}
		></mwc-textfield>`;
	}
}
