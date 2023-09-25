import { html } from 'lit';
import { ILocalization } from '../../Localization/Models/ILocalization';
import { ILocalized } from '../../Localization/Models/ILocalized';
import { ICollectionModel } from '../../Model/ICollectionModel';
import {
	ComponentFactory,
	IComponentActions,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../IComponentFactory';
import './LocalizedDisplay';
import { ILocalizedDisplayProps } from './LocalizedDisplay';
import './LocalizedEditor';
import { ILocalizedEditorProps } from './LocalizedEditor';

export function createGetter<
	TLocalization extends ILocalization,
	TLocalized extends ILocalized<TLocalization>
>(getter: (item: TLocalized) => ILocalization[]) {
	return getter;
}

export function createSetter<
	TLocalization extends ILocalization,
	TLocalized extends ILocalized<TLocalization>
>(setter: <TEntity extends TLocalized>(item: TEntity, value: ILocalization[]) => TEntity) {
	return setter;
}

export interface ILanguageConfiguration {
	languages: string[];
	defaultLanguage: string;
}

export class LocalizedComponentFactory extends ComponentFactory<ICollectionModel, ILocalization[]> {
	canHandle(collection: ICollectionModel): boolean {
		return collection.displayTypeName == 'ILocalization';
	}
	async edit(
		props: ILocalizedEditorProps,
		actions: IEditorComponentActions<ICollectionModel, ILocalization[]>
	) {
		// const localizedEditorProps: ILocalizedEditorProps = {
		// 	...props,
		// 	...this.state,
		// };
		return html`<drk-localized-editor
			.props=${props}
			.actions=${actions}
		></drk-localized-editor>`;
	}
	filter(
		props: IEditorComponentProps<ICollectionModel, ILocalization[]>,
		actions: IEditorComponentActions<ICollectionModel, ILocalization[]>,
		componentReady: (component: any) => void
	) {
		return props.model.type.properties
			.find((p) => p.name == props.model.name)
			.componentFactories[0].filter(props, actions, componentReady);
	}
	display(props: ILocalizedDisplayProps, actions: IComponentActions) {
		return html`<drk-localized-display .props=${props}></drk-localized-display>`;
	}
}
