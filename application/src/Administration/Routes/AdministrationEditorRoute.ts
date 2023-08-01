import { Routing } from '@drk/src';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import { msg } from '@lit/localize';
import '../Components/AdministrationEditor/AdministrationEditor';

export interface IAdministrationEditorRouteState {}

export interface IAdministrationEditorRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class AdministrationEditorRoute implements IRoute, IAdministrationEditorRoute {
	public constructor() {}
	public displayName: any = msg('Editor', { id: 'administrationDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		const initialState: IAdministrationEditorRouteState = {};
		return html`<drk-administration-editor></drk-administration-editor>`;
	}
}
