import { customElement, property } from '@lit/reactive-element/decorators.js';
import { css, html, LitElement, nothing } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import '@material/mwc-button';
import '../../ComponentFactories/EntityComponentFactory/DarkenginesEntityEditor';
import { IFormActions, IFormField, IFormProps } from '../Forms';

@customElement('drk-form')
export default class DarkenginesForm extends LitElement {
	@property({ type: Object })
	public darkenginesAdminProps: IFormProps;
	@property({ type: Object })
	public darkenginesAdminActions: IFormActions;
	constructor() {
		super();
	}
	public static get styles() {
		return css`
			:host {
				display: grid;
				grid-auto-flow: row;
				grid-template-columns: 1fr;
				align-items: center;
				justify-items: start;
				justify-content: start;
				grid-gap: var(--content-padding);
				padding: var(--content-padding);
				max-width: 100%;
				position: relative;
			}
			drk-entity-editor {
				width: 100%;
			}
		`;
	}

	public render() {
		if (!this.darkenginesAdminProps) return nothing;
		return html`
			${this.renderFields(Object.values(this.darkenginesAdminProps.fields))}
			<mwc-button
				raised
				@click=${async (e: Event) =>
					(this.darkenginesAdminProps = await this.darkenginesAdminActions.save(
						this.darkenginesAdminProps,
						this.darkenginesAdminProps.value
					))}
				>Save</mwc-button
			>
		`;
	}

	public renderFields(fields: IFormField[]) {
		return repeat(
			fields,
			(field) => field.name,
			(field) => {
				const props = field.getComponentProps(this.darkenginesAdminProps);
				const actions = field.getComponentActions(this.darkenginesAdminProps, {
					...this.darkenginesAdminActions,
					valueChanged: (props) => {
						props = this.darkenginesAdminActions.valueChanged(props);
						this.darkenginesAdminProps = props;
						return props;
					},
					formChanged: (props) => {
						this.darkenginesAdminActions.formChanged(props);
						this.darkenginesAdminProps = props;
						return props;
					},
				});
				return field.componentFactory.edit(props, actions);
			}
		);
	}
}
