import { Tail } from "ts-essentials";
import { Func } from "./Functional";
import { AnyMiddleware, makeMiddleware } from "./Middleware";
import { Namespace, makeNamespace } from "./Namespace";
import { ExecutableNode, RuntimeNodeType, RuntimeNode, RuntimeRouteType, RuntimeMiddlewareType, RuntimeNamespaceType, Node } from "./Node";
import { AnyRoute, makeRoute, IRouteContext } from "./Route";

export type ExecutableRuntimeNode<
	TExecutableNode extends ExecutableNode,
	TParentRuntimeNode extends AsRuntimeMiddleware<AnyMiddleware, any, any>
> = {
	execute: CompositeHandlerForExecutableParentNode<TExecutableNode, TParentRuntimeNode>;
	onBeforeHandlerExecution(): Promise<any>;
	onAfterHandlerExecution(): Promise<any>;
};

export type CompositeHandlerForExecutableParentNode<
	TNode extends ExecutableNode,
	TParentExecutableRuntimeNode extends ExecutableRuntimeNode<any, any>
> = TNode extends AnyRoute
	? Func<
			[TParentExecutableRuntimeNode] extends [never]
				? Tail<Tail<Parameters<TNode['handler']>>>
				: [TParentExecutableRuntimeNode] extends [never]
				? []
				: [
						...Parameters<TParentExecutableRuntimeNode['execute']>,
						...Tail<Parameters<TNode['handler']>>
				  ],
			ReturnType<TNode['handler']>
	  >
	: Func<
			[TParentExecutableRuntimeNode] extends [never]
				? Tail<Tail<Parameters<TNode['handler']>>>
				: [TParentExecutableRuntimeNode] extends [never]
				? []
				: [
						...Parameters<TParentExecutableRuntimeNode['execute']>,
						...Tail<Tail<Parameters<TNode['handler']>>>
				  ],
			ReturnType<TNode['handler']>
	  >;

export type Guard<
	TNode extends Node,
	TParent extends AsRuntimeNode<any, any, any>,
	TExecutableParent extends AsRuntimeMiddleware<AnyMiddleware, any, any>
> = TNode extends { type: RuntimeNodeType; node: AnyRoute | AnyMiddleware | Namespace }
	? AsRuntimeNode<TNode['node'], TParent, TExecutableParent>
	: AsRuntimeNode<TNode, TParent, TExecutableParent>;

export type AsRuntimeNode<
	TNode extends Node,
	TParentNode extends RuntimeNode,
	TParentMiddleware extends AsRuntimeMiddleware<AnyMiddleware, any, any>
> = TNode extends AnyRoute
	? AsRuntimeRoute<TNode, TParentNode, TParentMiddleware>
	: TNode extends AnyMiddleware
	? AsRuntimeMiddleware<TNode, TParentNode, TParentMiddleware>
	: TNode extends Namespace
	? AsRuntimeNamespace<TNode, TParentNode, TParentMiddleware>
	: never;

export type AsRuntimeRoute<
	TNode extends AnyRoute,
	TParentNode extends RuntimeNode,
	TParentMiddleware extends AsRuntimeMiddleware<AnyMiddleware, any, any>
> = ExecutableRuntimeNode<TNode, TParentMiddleware> & {
	type: RuntimeRouteType;
	node: TNode;
} & ([TParentNode] extends [never] ? {} : { parent: TParentNode }) &
	([TParentMiddleware] extends [never] ? {} : { executableParent: TParentMiddleware });

export type AsRuntimeMiddleware<
	TNode extends AnyMiddleware,
	TParentNode extends RuntimeNode,
	TParentMiddleware extends AsRuntimeMiddleware<AnyMiddleware, any, any>
> = ExecutableRuntimeNode<TNode, TParentMiddleware> & {
	type: RuntimeMiddlewareType;
	node: TNode;
	children: {
		[key in keyof TNode['children']]: Guard<
			TNode['children'][key],
			AsRuntimeNode<TNode, TParentNode, TParentMiddleware>, //IGNORE ERROR
			AsRuntimeMiddleware<TNode, TParentNode, TParentMiddleware>
		>;
	};
} & ([TParentNode] extends [never] ? {} : { parent: TParentNode }) &
	([TParentMiddleware] extends [never] ? {} : { executableParent: TParentMiddleware });
export type AsRuntimeNamespace<
	TNode extends Namespace,
	TParentNode extends RuntimeNode,
	TParentMiddleware extends AsRuntimeMiddleware<AnyMiddleware, any, any>
> = {
	type: RuntimeNamespaceType;
	node: TNode;
	children: {
		[key in keyof TNode['children']]: Guard<
			TNode['children'][key],
			AsRuntimeNode<TNode, TParentNode, TParentMiddleware>, //IGNORE ERROR
			TParentMiddleware
		>;
	};
} & ([TParentNode] extends [never] ? {} : { parent: TParentNode }) &
	([TParentMiddleware] extends [never] ? {} : { executableParent: TParentMiddleware });

function asRuntimeNode<TNode extends Node>(node: TNode): AsRuntimeNode<TNode, never, never> {
	return null as any;
}

const route0 = makeRoute({
	path: ['/index'],
	type: 'Route',
	handler: (context: IRouteContext, x: number) => x,
});

const middleware0 = makeMiddleware({
	path: ['/index'],
	type: 'Middleware',
	children: {
		route0,
	},
	handler: (context: IRouteContext, next: () => any, x: number) => x,
});

const namespace0 = makeNamespace({
	type: 'Namespace',
	children: {
		middleware0,
	},
});

const runtimeNamespace = asRuntimeNode(namespace0);

const middleware1 = makeMiddleware({
	path: ['/index'],
	type: 'Middleware',
	children: {
		runtimeNamespace,
		namespace0,
	},
	handler: (context: IRouteContext, next: () => any, x: number) => x,
});

const runtimeMiddleware = asRuntimeNode(middleware1);
runtimeMiddleware.children.runtimeNamespace.children.middleware0.execute()