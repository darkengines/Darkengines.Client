import { SelectedDetail } from '@material/mwc-list';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { IPropertyModel } from '../../Model/IPropertyModel';
import { IEditorComponentActions, IEditorComponentProps } from '../IComponentFactory';

@customElement('drk-boolean-editor')
class BooleanEditor extends LitElement {
	@property({ type: Object })
	public props: IEditorComponentProps<IPropertyModel, boolean>;
	public actions: IEditorComponentActions<IPropertyModel, boolean>;
	render() {
		return html`<mwc-select
			style="justify-self: end;"
			outlined
			?required=${!this.props!.model!.isNullable}
			.label=${this.props!.model!.name}
			${ref((element) => {
				if (element && this.props.component) {
					Object.keys(this.props.component).forEach(
						(key) => (element[key] = this.props.component[key])
					);
				}
			})}
			@selected=${(e: CustomEvent<SelectedDetail>) => {
				const value = BooleanEditor.items[e.detail.index as number].value as boolean;
				if (this.props.value !== value) {
					this.actions.valueChanged?.({ ...this.props, value });
				}
			}}
		>
			${repeat(
				BooleanEditor.items,
				(item) => item.value,
				(item) => html`<mwc-list-item>${item.displayName}</mwc-list-item>`
			)}
		</mwc-select>`;
	}

	protected static items = [
		{
			displayName: 'Both',
			value: undefined,
		},
		{
			displayName: 'Yes',
			value: true,
		},
		{
			displayName: 'No',
			value: false,
		},
	];
}
