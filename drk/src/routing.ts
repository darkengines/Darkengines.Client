import { flatten } from 'lodash';
import { Dictionary, Tail } from 'ts-essentials';
import { Func } from './functional';
import { getConfig } from '../src/config';

export interface IRuntimeNode {
	parent?: IRuntimeNode;
	parentMiddleware?: IRuntimeMiddleware;
	beforeExecute: (node: IRuntimeNode, args: any[]) => void;
	afterExecute: (node: IRuntimeNode, args: any[], result: any) => void;
	beforeHandlerExecute: (node: IRuntimeNode, args: any[]) => void;
	afterHandlerExecute: (node: IRuntimeNode, args: any[], result: any) => void;

	onExecute(node: IRuntimeNode, executionNode: IExecutionNode, args: any[]): any;
	onBeforeExecute(node: IRuntimeNode, args: any[]): void;
	onAfterExecute(node: IRuntimeNode, args: any[], result: any): void;
	onBeforeHandlerExecute(node: IRuntimeNode, args: any[]): void;
	onAfterHandlerExecute(node: IRuntimeNode, args: any[], result: any): void;
}

export type NodeFunctionArgs<TFunction> = TFunction extends (...args: any[]) => any
	? [Tail<Tail<Parameters<TFunction>>>] extends [never]
		? []
		: Tail<Tail<Parameters<TFunction>>>
	: [];

export type NodeExecuteArgs<TFunction> = TFunction extends (...args: any[]) => any
	? [Tail<Parameters<TFunction>>] extends [never]
		? []
		: Tail<Parameters<TFunction>>
	: [];
export interface IRouteContext {
	node: IRuntimeRoute;
}

export type RouteFunctionParameters<TParams extends any[]> = [
	context: IRouteContext,
	...args: TParams
];
export type RouteFunction<TArgs extends any[], TOut> = Func<RouteFunctionParameters<TArgs>, TOut>;
export type AnyRouteFunction = RouteFunction<any, any>;
export interface IMiddlewareContext {
	node: any;
}
export type MiddleWareFunctionParameters<TParams extends any[], TNextResult = any> = [
	context: IMiddlewareContext,
	next: () => TNextResult,
	...args: TParams
];
export type MiddlewareFunction<TArgs extends any[], TOut, TNextResult = any> = Func<
	MiddleWareFunctionParameters<TArgs, TNextResult>,
	TOut
>;
export type AnyMiddlewareFunction = MiddlewareFunction<any, any>;
export interface IRouteNode<TResult = any> {
	path: string | string[];
	route: IRoute<TResult>;
}
export interface IRoute<TResult = any> {
	handler: RouteFunction<any, TResult>;
	display?: () => any;
}
export interface INamespaceNode<TNextResult = any>
	extends Dictionary<
		IRouteNode<TNextResult> | IMiddlewareNode<any, TNextResult> | INamespaceNode<TNextResult>
	> {}
export interface IRuntimeNamespace extends IRuntimeNode {
	namespace: INamespaceNode;
	children: Dictionary<IRuntimeNode>;
}
export interface IRuntimeRoute extends IRuntimeNode {
	route: IRouteNode;
	execute: (...args: any[]) => any;
	getPath: (...args: any[]) => string;
}
export interface IMiddlewareNode<TNextResult = any, TResult = any> {
	path?: string | string[];
	children: Dictionary<
		IRouteNode<TNextResult> | IMiddlewareNode<any, TNextResult> | INamespaceNode<TNextResult>
	>;
	middleware: IMiddleware<TNextResult, TResult>;
}
export interface IMiddleware<TNextResult = any, TResult = any> {
	handler: MiddlewareFunction<any, TResult, TNextResult>;
	display?: () => any;
}
export interface IRuntimeMiddleware<
	TNextResult = any,
	TExecute extends (next: () => TNextResult, ...args: any[]) => any = (
		next: () => TNextResult
	) => TNextResult
> extends IRuntimeNode {
	middleware: IMiddlewareNode;
	execute: TExecute;
	getPath: (...args: any[]) => string;
	children: Dictionary<IRuntimeNode>;
}

export type Node<
	TNode extends IRouteNode | IMiddlewareNode | INamespaceNode,
	TParentNode extends IRuntimeNamespace | IRuntimeMiddleware | IRuntimeRoute | undefined,
	TParentMiddleware extends IRuntimeMiddleware | undefined
> = TNode extends IMiddlewareNode
	? Middleware<TNode, TParentNode, TParentMiddleware>
	: TNode extends IRouteNode
	? Route<TNode, TParentNode, TParentMiddleware>
	: TNode extends INamespaceNode
	? Namespace<TNode, TParentNode, TParentMiddleware>
	: never;

type Middleware<
	TMiddleware extends IMiddlewareNode,
	TParentNode extends IRuntimeNamespace | IRuntimeMiddleware | IRuntimeRoute | undefined,
	TParentMiddleware extends IRuntimeMiddleware | undefined
> = IRuntimeMiddleware & {
	middleware: TMiddleware;
	children: {
		[key in keyof TMiddleware['children']]: Node<
			TMiddleware['children'][key],
			Middleware<TMiddleware, TParentNode, TParentMiddleware>,
			Middleware<TMiddleware, TParentNode, TParentMiddleware>
		>;
	};
	parent: TParentNode;
	parentMiddleware: TParentMiddleware;

	execute: (
		next: () => any,
		...args: [TParentMiddleware] extends [null]
			? NodeFunctionArgs<TMiddleware['middleware']['handler']>
			: [
					...NodeExecuteArgs<
						TParentMiddleware extends IRuntimeNode ? TParentMiddleware['execute'] : []
					>,
					...NodeFunctionArgs<TMiddleware['middleware']['handler']>
			  ]
	) => ReturnType<TMiddleware['middleware']['handler']>;
	getPath: (
		...args: [TParentMiddleware] extends [null]
			? NodeFunctionArgs<TMiddleware['middleware']['handler']>
			: [
					...NodeExecuteArgs<
						TParentMiddleware extends IRuntimeNode ? TParentMiddleware['execute'] : []
					>,
					...NodeFunctionArgs<TMiddleware['middleware']['handler']>
			  ]
	) => ReturnType<TMiddleware['middleware']['handler']>;
};
type Namespace<
	TNamespace extends INamespaceNode,
	TParentNode extends IRuntimeNamespace | IRuntimeMiddleware | IRuntimeRoute | undefined,
	TParentMiddleware extends IRuntimeMiddleware | undefined
> = IRuntimeNamespace & {
	parent: TParentNode;
	parentMiddleware: TParentMiddleware;
	children: {
		[key in keyof TNamespace]: Node<
			TNamespace[key],
			Namespace<TNamespace, TParentNode, TParentMiddleware>,
			TParentMiddleware
		>;
	};
};
type Route<
	TRoute extends IRouteNode,
	TParentNode extends IRuntimeNode | undefined,
	TParentMiddleware extends IRuntimeMiddleware | undefined
> = IRuntimeNode & {
	route: TRoute;
	parent: TParentNode;
	parentMiddleware: TParentMiddleware;
	// execute2: ChangeNodeReturnType<
	// 	TParentMiddleware,
	// 	(
	// 		...args: Tail<Parameters<TRoute['route']['handler']>>
	// 	) => ReturnType<TRoute['route']['handler']>
	// >;
	execute: (
		...args: [
			...NodeExecuteArgs<
				TParentMiddleware extends IRuntimeNode ? TParentMiddleware['execute'] : []
			>,
			...Tail<Parameters<TRoute['route']['handler']>>
		]
	) => any;
	getPath: (
		...args: [
			...NodeExecuteArgs<
				TParentMiddleware extends IRuntimeNode ? TParentMiddleware['execute'] : []
			>,
			...Tail<Parameters<TRoute['route']['handler']>>
		]
	) => string;
};

export function makeNamespace<TNamespace extends INamespaceNode>(namespace: TNamespace) {
	return namespace;
}
export function makeMiddleware<
	TMiddleware extends IMiddleware,
	TNode extends (TMiddleware extends IMiddleware<infer TNextResult, infer TResult>
		? IMiddlewareNode<TNextResult, TResult>
		: IMiddlewareNode)['children']
>(path: string | string[], middleware: TMiddleware, children: TNode) {
	return {
		path,
		middleware,
		children,
	};
}
export function makeRoute<TRoute extends IRouteNode>(route: TRoute) {
	return route;
}

const parameterRegex = /(?<parameter>(?<type>\:|\*|)(?<name>[^\/]+))/gm;
export function getPath(pattern: string, args: any[]) {
	if (pattern == '/') return pattern;
	let match: RegExpExecArray | null;
	let index: number = 0;
	const segments: string[] = [];
	while ((match = parameterRegex.exec(pattern))) {
		segments.push(
			match.groups!.type == ':' || match.groups!.type == '*'
				? args[index++]
				: match.groups!.name
		);
	}
	return segments.join('/');
}
export function combineURLs(baseURL: string, relativeURL: string) {
	return relativeURL
		? baseURL
			? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
			: '/' + relativeURL.replace(/^\/+/, '')
		: baseURL;
}

export abstract class RuntimeNode implements IRuntimeNode {
	parent?: IRuntimeNode;
	parentMiddleware?: IRuntimeMiddleware;
	onExecute(_node: IRuntimeNode, _executionNode: IExecutionNode, _args: any[]): any {
		return undefined;
	}
	beforeExecute: (node: IRuntimeNode, args: any[]) => void;
	afterExecute: (node: IRuntimeNode, args: any[], result: any) => void;
	beforeHandlerExecute: (node: IRuntimeNode, args: any[]) => void;
	afterHandlerExecute: (node: IRuntimeNode, args: any[], result: any) => void;
	onBeforeExecute(node: IRuntimeNode, args: any[]) {
		this.beforeExecute?.(node, args);
		this.parent?.onBeforeExecute?.(node, args);
	}
	onAfterExecute(node: IRuntimeNode, args: any[], result: any) {
		this.afterExecute?.(node, args, result);
		this.parent?.onAfterExecute?.(node, args, result);
	}
	onBeforeHandlerExecute(node: IRuntimeNode, args: any[]) {
		this.beforeHandlerExecute?.(node, args);
		this.parent?.onBeforeHandlerExecute?.(node, args);
	}
	onAfterHandlerExecute(node: IRuntimeNode, args: any[], result: any) {
		this.afterHandlerExecute?.(node, args, result);
		this.parent?.onAfterHandlerExecute?.(node, args, result);
	}
}

interface IExecutionNode {
	node: RuntimeMiddleware | RuntimeRoute;
	next?: IExecutionNode;
	customNext?: () => any;
}

function getRemainingArgs(executionNode: IExecutionNode, args: any[]): any[] {
	return getArgs(executionNode.next!, args);
}

function getArgs(executionNode: IExecutionNode, args: any[]): any[] {
	if (!executionNode) return args;
	if (!args || !args.length) return [];
	if (executionNode.node instanceof RuntimeMiddleware) {
		if (executionNode.node.middleware?.middleware?.handler) {
			const limit = -executionNode.node.middleware.middleware.handler.length + 2;
			return limit ? args : getArgs(executionNode.next!, args).slice(0, limit);
		} else {
			return getArgs(executionNode.next!, args);
		}
	} else if (executionNode.node instanceof RuntimeRoute) {
		const limit = -executionNode.node.route.route.handler.length + 1;
		return limit ? args.slice(0, limit) : args;
	}
	return [];
}

function execute(node: IRuntimeNode, executionNode: IExecutionNode, args: any[]): any {
	const actualArgs = getRemainingArgs(executionNode, args);
	if (executionNode.node instanceof RuntimeMiddleware) {
		if (executionNode.node.middleware?.middleware?.handler) {
			const argsTail = args.slice(actualArgs.length);
			return executionNode.node.middleware.middleware.handler(
				{ node },
				executionNode.next
					? () => execute(node, executionNode.next!, argsTail)
					: executionNode.customNext!,
				...actualArgs
			);
		} else {
			return execute(node, executionNode.next!, args);
		}
	}
	if (executionNode.node instanceof RuntimeRoute) {
		return executionNode.node.route.route.handler({ node: node as RuntimeRoute }, ...args);
	}
}

export class RuntimeMiddleware extends RuntimeNode implements IRuntimeMiddleware {
	public constructor(
		middleware: IMiddlewareNode,
		parent?: IRuntimeNode,
		parentMiddleware?: IRuntimeMiddleware
	) {
		super();
		this.middleware = middleware;
		this.parent = parent;
		this.parentMiddleware = parentMiddleware;
		this.children = Object.fromEntries(
			Object.entries(middleware.children).map(([key, child]) => [
				key,
				buildNode(child, this, this),
			])
		);
	}
	middleware: IMiddlewareNode;
	children: Dictionary<IRuntimeNode>;
	parent: IRuntimeNode | undefined;
	parentMiddleware: IRuntimeMiddleware | undefined;
	onExecute(node: IRuntimeNode, executionNode: IExecutionNode, args: any[]): any {
		const currentExecutionNode = { node: this, next: executionNode };
		if (!this.parentMiddleware) {
			return execute(node, currentExecutionNode, args);
		} else {
			return this.parentMiddleware.onExecute(node, currentExecutionNode, args);
		}
	}
	execute(next: () => any, ...args: any[]): any {
		this.onBeforeExecute(this, args);
		const executionNode = { node: this, customNext: next };
		const result = this.onExecute(this, executionNode, args);
		this.onAfterExecute(this, args, result);
		return result;
	}
	getPath(...args: any[]): string {
		if (!this.parentMiddleware) return getPath(getDefaultPath(this.middleware.path!)!, args);
		const middlewareArgs = this.middleware.middleware?.handler
			? args.slice(-this.middleware.middleware.handler.length + 1)
			: [];
		let path = getPath(getDefaultPath(this.middleware.path!)!, middlewareArgs);
		path = combineURLs(
			this.parentMiddleware.getPath(
				...(this.middleware.middleware?.handler
					? args.slice(0, -this.middleware.middleware.handler.length + 1)
					: args)
			),
			path
		);
		return path;
	}
}
function getDefaultPath(path: string | string[]) {
	return path instanceof Array ? path[0] : path;
}
export class RuntimeNamespace extends RuntimeNode implements IRuntimeNamespace {
	public constructor(
		namespace: INamespaceNode,
		parent?: IRuntimeNode,
		parentMiddleware?: IRuntimeMiddleware
	) {
		super();
		this.namespace = namespace;
		this.parent = parent;
		this.parentMiddleware = parentMiddleware;
		this.children = Object.fromEntries(
			Object.entries(namespace).map(([key, child]) => [
				key,
				buildNode(child, this, this.parentMiddleware),
			])
		);
	}
	namespace: INamespaceNode;
	children: Dictionary<IRuntimeNode, string>;
}
export class RuntimeRoute extends RuntimeNode implements IRuntimeRoute {
	public constructor(
		route: IRouteNode,
		parent?: IRuntimeNode,
		parentMiddleware?: IRuntimeMiddleware
	) {
		super();
		this.route = route;
		this.parent = parent;
		this.parentMiddleware = parentMiddleware;
	}
	route: IRouteNode;
	parentMiddleware?: IRuntimeMiddleware;
	execute(...args: any[]): any {
		let result: any;
		this.onBeforeExecute(this, args);
		if (!this.parentMiddleware) {
			this.onBeforeHandlerExecute(this, args);
			result = this.route.route.handler({ node: this }, ...args);
			this.onAfterHandlerExecute(this, args, result);
		} else {
			const executionNode = { node: this };
			result = this.parentMiddleware.onExecute(this, executionNode, args);
		}
		this.onAfterExecute(this, args, result);
		return result;
	}
	getPath(...args: any[]): string {
		if (!this.parentMiddleware) return getPath(getDefaultPath(this.route.path!)!, args);
		const routeArgs = args.slice(-this.route.route.handler.length + 1);
		let path = getPath(getDefaultPath(this.route.path!)!, routeArgs);
		path = combineURLs(
			this.parentMiddleware.getPath(...args.slice(0, -this.route.route.handler.length + 1)),
			path
		);
		return path;
	}
}

export function buildNode<
	TNode extends IRouteNode | IMiddlewareNode | INamespaceNode,
	TParentNode extends IRuntimeNamespace | IRuntimeMiddleware | IRuntimeRoute | undefined,
	TParentMiddleware extends IRuntimeMiddleware | undefined
>(
	node: TNode,
	parent?: TParentNode,
	parentMiddleware?: TParentMiddleware
): Node<TNode, TParentNode, TParentMiddleware> {
	let result: IRuntimeNode;
	if ((<IMiddlewareNode>node)['children'])
		result = new RuntimeMiddleware(node as IMiddlewareNode, parent, parentMiddleware);
	else if (node['path'] && (<IRouteNode>node)['route'])
		result = new RuntimeRoute(node as IRouteNode, parent, parentMiddleware);
	else result = new RuntimeNamespace(node as INamespaceNode, parent, parentMiddleware);
	return result as Node<TNode, TParentNode, TParentMiddleware>;
}

export function getRoutes(
	applicationNode: IRuntimeNode
): { path: string; handler: IRuntimeNode }[][] {
	if (applicationNode instanceof RuntimeRoute) {
		if (applicationNode.route.path instanceof Array) {
		}
		if (applicationNode.route.path instanceof Array) {
			return applicationNode.route.path.map((path) => [{ path, handler: applicationNode }]);
		} else {
			return [[{ path: applicationNode.route.path, handler: applicationNode }]];
		}
	}
	if (applicationNode instanceof RuntimeMiddleware) {
		const childrenRoutes = flatten(
			Object.values(applicationNode.children).map((child) => {
				return getRoutes(child);
			})
		);
		let routes: { path: string; handler: IRuntimeNode }[][];
		if (applicationNode.middleware.path instanceof Array) {
			routes = flatten(
				applicationNode.middleware.path.map((path) => {
					return childrenRoutes.map((childrenRoute) => [
						{ path, handler: applicationNode },
						...childrenRoute,
					]);
				})
			);
		} else {
			routes = childrenRoutes.map((route) => {
				return [
					{
						path: applicationNode.middleware.path as string,
						handler: applicationNode,
					},
					...route,
				];
			});
		}
		return routes;
	}
	if (applicationNode instanceof RuntimeNamespace) {
		return flatten(
			Object.values(applicationNode.children).map((child) => {
				return getRoutes(child);
			})
		);
	}
	return [];
}

export async function getCurrentPath() {
	let hash = location.hash.substr(1);
	if (hash == '') hash = '/';
	return (await getConfig()).Router.useHash ? hash : location.pathname;
}
