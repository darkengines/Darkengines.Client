import { html } from 'lit';
import { state } from 'lit-element';
import { ICollectionModel } from '../../Model/ICollectionModel';
import '../../StringExtensions';
import {
	ComponentFactory,
	IComponentActions,
	IComponentProps,
	IEditorComponentActions,
	IEditorComponentProps,
} from '../IComponentFactory';
import './CollectionEditor';
import { ICollectionEditorActions, ICollectionEditorProps } from './CollectionEditor';
import { inject, multiInject } from 'inversify';
import { setFilter, setOrder, setPagination, setModel } from 'drk/src/Grid/Grid';
import { IDarkenginesAdminActions } from 'drk/src/Grid/IDarkenginesAdminActions';
import { IDarkenginesAdminProps } from 'drk/src/Grid/IDarkenginesAdminProps';
import { IEntityModel } from 'drk/src/Model/IEntityModel';
import { IColumnFactory } from 'drk/src/Components/DarkenginesGrid/IColumnFactory';
import { Grid } from 'drk/src/Components/DarkenginesGrid/Grid';
import {
	IDarkenginesGridActions,
	IDarkenginesGridProps,
} from 'drk/src/Components/DarkenginesGrid/IDarkenginesGrid';

export interface ICollectionValue {
	collection: ICollectionModel;
	value: any;
}

export default class CollectionComponentFactory extends ComponentFactory<ICollectionModel, object> {
	protected columnFactories: IColumnFactory[];
	constructor(columnFactories: IColumnFactory[]) {
		super();
		this.columnFactories = columnFactories;
	}
	canHandle(model: ICollectionModel) {
		return model.modelType == 'CollectionModel';
	}
	async edit(props: ICollectionEditorProps, actions: ICollectionEditorActions) {

		const collectionProps = await setModel(
			{ model: props.model.type, grid: props.grid },
			props.model.type,
			this.columnFactories
		);

		props = {
			...props,
			grid: collectionProps.grid.then(async x => {
				return {
					...props.grid,
					...x
				};
			}),
		};

		return html`<drk-collection-editor
			.props=${props}
			.actions=${actions}
		></drk-collection-editor>`;
	}
	filter(
		props: IEditorComponentProps<ICollectionModel, object>,
		actions: IEditorComponentActions<ICollectionModel, object>
	) {
		return html`filter(collection)`;
	}
	display(props: IComponentProps<ICollectionModel, object>, actions: IComponentActions) {
		return 'display(collection)';
	}
}
