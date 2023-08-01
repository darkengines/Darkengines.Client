import { Routing } from '@drk/src';
import { inject } from 'inversify/lib/annotation/inject';
import { injectable } from 'inversify/lib/annotation/injectable';
import { html } from 'lit';
import { IRoute } from '@drk/src/routing';
import '@drk/src/Components/DarkenginesCombobox/DarkenginesCombobox';
import { msg } from '@lit/localize';
import { ref } from 'lit/directives/ref.js';
import Schema from '@drk/src/Model/Schema';
import { Designer } from '@drk/src/Components/DarkenginesDesigner/DarkenginesDesigner';
import '@drk/src/Components/DarkenginesDesigner/DarkenginesDesigner';
import { schemaSample } from '@drk/src/schema_sample';

export interface IDesignerRouteState {}

export interface IDesignerRoute {
	handler: (_: Routing.IRouteContext) => any;
}

@injectable()
export class DesignerRoute implements IRoute, IDesignerRoute {
	public readonly schema: Schema;
	public constructor(@inject(Schema) schema: Schema) {
		this.schema = schema;
	}
	public displayName: any = msg('Designer', { id: 'designerDisplayName' });
	public async handler(_: Routing.IRouteContext) {
		let designer: Designer;
		//const schema = await this.schema.model;
		const schema = schemaSample;
		const models = Object.values(schema);
		return html`<drk-designer
			${ref((part: Designer) => {
				if (part) {
					designer = part;
				}
			})}
			.models=${models}
		></drk-designer>`;
	}
}
