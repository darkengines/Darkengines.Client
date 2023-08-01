import { Func } from "./Functional";
import { RouteType, RuntimeRouteType } from "./Node";

export interface IRouteContext {}
export type RouteFunctionParameters<TParams extends any[]> = [
	context: IRouteContext,
	...args: TParams
];
export type RouteFunction<TIn extends any[], TOut> = Func<RouteFunctionParameters<TIn>, TOut>;
export type Route<TIn extends any[], TOut> = {
	type: RouteType;
	path: string[];
	handler: RouteFunction<TIn, TOut>;
};
export type AnyRoute = Route<any[], any>;
export type RuntimeRoute<TIn extends any[], TOut> = {
	type: RuntimeRouteType;
	execute: Func<TIn, TOut>;
};
export type AnyRuntimeRoute = RuntimeRoute<any[], any>;
export function makeRoute<TRoute extends AnyRoute>(node: TRoute): TRoute {
	return node;
}