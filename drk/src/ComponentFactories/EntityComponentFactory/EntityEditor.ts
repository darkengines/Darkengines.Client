import { css, html, LitElement, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IEntityModel } from '../../Model/IEntityModel';
import { IEditorComponentActions, IEditorComponentProps } from '../IComponentFactory';
import '@material/mwc-icon-button';
import mdcTypographyStyles from '!raw-loader!@material/typography/dist/mdc.typography.css';
import '@material/mwc-formfield';
import { repeat } from 'lit/directives/repeat.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IFormField } from '../../Components/Forms';

export interface IEntityEditorProps extends IEditorComponentProps<IEntityModel, object> {
	fields: IFormField[];
}

@customElement('drk-entity-editor')
export default class EntityEditor extends LitElement {
	@property({ type: Object })
	public props: IEntityEditorProps;
	public actions: IEditorComponentActions<IPropertyModel, object>;
	public static get styles() {
		return [
			unsafeCSS(mdcTypographyStyles),
			css`
				:host {
					display: grid;
					grid-auto-flow: row;
					grid-template-columns: 1fr;
					align-items: center;
					justify-items: start;
					justify-content: start;
					grid-gap: var(--content-spacing);
				}
			`,
		];
	}
	render() {
		return repeat(
			this.props.fields,
			(field) => field.name,
			(field) => field.componentFactory.edit(this.props, this.actions)
		);
	}
}
