import { Routing } from '../../drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import Schema from '../../drk/src/Model/Schema';
import { IRoute } from '../../drk/src/routing';
import '../../drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';

@injectable()
export class AdminRoute implements IRoute {
	protected schema: Schema;
	public constructor(@inject(Schema) schema: Schema) {
		this.schema = schema;
	}
	public displayName: any = 'Index';
	public async handler(_: Routing.IRouteContext) {
		await this.schema.model;
		return html` <h3>Admin PROUT</h3> `;
	}
}
