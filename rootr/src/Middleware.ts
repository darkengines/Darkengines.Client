import { Dictionary } from 'ts-essentials';
import { AnyFunction, Func } from './Functional';
import { MiddlewareType, RuntimeMiddlewareType, RuntimeNode, Node } from './Node';

export type Middleware<TIn extends any[], TOut> = {
	type: MiddlewareType;
	path?: string[];
	children: Dictionary<Node>;
	handler: MiddlewareFunction<TIn, TOut>;
};
export interface IMiddlewareContext {}
export type MiddleWareFunctionParameters<TIn extends any[]> = [
	context: IMiddlewareContext,
	next: AnyFunction,
	...args: TIn
];
export type MiddlewareFunction<TIn extends any[], TOut> = Func<
	MiddleWareFunctionParameters<TIn>,
	TOut
>;
export type AnyMiddleware = Middleware<any[], any>;
export type RuntimeMiddleware<TIn extends any[], TOut> = {
	type: RuntimeMiddlewareType;
	execute: Func<TIn, TOut>;
	children: Dictionary<RuntimeNode>;
};
export function makeMiddleware<TMiddleware extends AnyMiddleware>(node: TMiddleware): TMiddleware {
	return node;
}