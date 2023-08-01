import { AnyMiddleware } from "./Middleware";
import { Namespace } from "./Namespace";
import { AnyRoute } from "./Route";

export type RouteType = 'Route';
export type MiddlewareType = 'Middleware';
export type NamespaceType = 'Namespace';
export type RuntimeType = 'Runtime';
export type RuntimeRouteType = `${RuntimeType}${RouteType}`;
export type RuntimeMiddlewareType = `${RuntimeType}${MiddlewareType}`;
export type RuntimeNamespaceType = `${RuntimeType}${NamespaceType}`;
export type ExecutableType = RouteType | MiddlewareType;
export type RuntimeNodeType = RuntimeRouteType | RuntimeMiddlewareType | RuntimeNamespaceType;
export type ExecutableRuntimeType = RuntimeRouteType | RuntimeMiddlewareType;
export type NodeType =
	| RouteType
	| MiddlewareType
	| NamespaceType
	| RuntimeRouteType
	| RuntimeMiddlewareType
	| RuntimeNamespaceType;

export type Node = {
	type: NodeType;
};
export type ExecutableNode = AnyRoute | AnyMiddleware;
export type RuntimeNode = {
	type: RuntimeNodeType;
	node: AnyRoute | AnyMiddleware | Namespace;
};
