import { IEvent } from 'ste-events';
import { Dictionary, Tail } from 'ts-essentials';

export interface IStateChangedEventArgs<TState> {
	state: TState;
	previousState: TState;
}

export type Reducer<TState, TArgs extends any[] = any[]> = (state: TState, ...args: TArgs) => Promise<TState>;
export type AnyReducer = Reducer<any, any>;

export type Action<TReducer extends Reducer<any, any>> = (
	...args: Tail<Parameters<TReducer>>
) => ReturnType<TReducer>;
export type Actions<TReducers extends Dictionary<Reducer<any, any>>> = {
	[key in keyof TReducers]: Action<TReducers[key]>;
};
export default interface IStateful<TState, TActions> {
	stateChanged: IEvent<IStateful<TState, TActions>, IStateChangedEventArgs<TState>>;
	state: TState;
	actions: TActions;
}
