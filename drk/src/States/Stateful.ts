import { PromiseEventDispatcher, IPromiseEvent } from 'ste-promise-events';
import { Dictionary, Tail } from 'ts-essentials';
import { CompositeReducer, CompositeStateful, StateComposition } from './CompositeStateful';
import IStateful, { Actions, IStateChangedEventArgs, Reducer } from './IStateful';

class Stateful<TState, TReducers extends Dictionary<Reducer<TState, any>>>
	implements IStateful<TState, Actions<TReducers>>
{
	public static create<TState, TReducers extends Dictionary<Reducer<TState, any>>>(
		state: TState,
		reducers: TReducers
	) {
		return new Stateful<TState, TReducers>(state, reducers);
	}
	public static compose<
		TCompositeStateful extends Dictionary<IStateful<any, any>>,
		TState,
		TReducers extends CompositeReducer<TState, TCompositeStateful>
	>(
		compositeStateful: TCompositeStateful,
		state: TState,
		mapState: (
			state: TState,
			compositeState: StateComposition<TCompositeStateful>
		) => Promise<TState>,
		reducers?: TReducers
	) {
		return new CompositeStateful<TCompositeStateful, TState, TReducers>(
			compositeStateful,
			state,
			mapState,
			reducers
		);
	}
	public constructor(state: TState, reducers: TReducers) {
		this.state = state;
		this.actions = Object.fromEntries(
			Object.entries(reducers).map(([key, reducer]) => {
				return [
					key,
					async (...args: Tail<Parameters<typeof reducer>>) => {
						const previousState = this.state;
						const state = await reducer(this.state, ...args);
						this.state = state;
						await this.onStateChanged({ state, previousState });
						return state;
					},
				];
			})
		) as any;
		this.stateChangedEvent = new PromiseEventDispatcher<
			typeof this,
			IStateChangedEventArgs<TState>
		>();
		this.stateChanged = this.stateChangedEvent.asEvent();
	}
	protected async onStateChanged(stateChangedEventArgs: IStateChangedEventArgs<TState>) {
		await this.stateChangedEvent.dispatch(this, stateChangedEventArgs);
	}
	protected stateChangedEvent: PromiseEventDispatcher<
		typeof this,
		IStateChangedEventArgs<TState>
	>;
	public stateChanged: IPromiseEvent<typeof this, IStateChangedEventArgs<TState>>;
	public state: TState;
	public actions: Actions<TReducers>;
}

export { Stateful };
