import { IMiddlewareContext, middleware } from '../src/Middleware';
import { namespace } from '../src/Namespace';
import { IRouteContext, route } from '../src/Route';
import { executable } from '../src/RuntimeNode';

const r = route({
	type: 'Route',
	path: ['/'],
	handler: (context: IRouteContext, z: number) => 1,
});
r.handler({}, 1);

const m = middleware({
	type: 'Middleware',
	path: ['/'],
	children: {
		index: r,
	},
	handler: (context: IMiddlewareContext, next: any, y: number) => 'Hello',
});
m.handler({}, () => '', 1);

const s = executable(m);

const n = namespace({
	type: 'Namespace',
	children: {
		m,
	},
});

const rm = middleware({
	type: 'Middleware',
	path: ['/'],
	children: {
		n,
		s
	},
	handler: (context: IMiddlewareContext, next: any, x: number) => 'Hello',
});

const root = executable(rm);
root.children.s.execute(1,2)
