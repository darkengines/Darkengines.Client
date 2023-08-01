export type Func<TArgs extends any[], TOut> = (...args: TArgs) => TOut;
export type AnyFunction = Func<any, any>;