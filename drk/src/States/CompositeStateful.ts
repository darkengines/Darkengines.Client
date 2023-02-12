import { IPromiseEvent, PromiseEventDispatcher } from 'ste-promise-events';
import { Dictionary, Tail } from 'ts-essentials';
import IStateful, { Actions, IStateChangedEventArgs } from './IStateful';

export type StateComposition<TCompositeStateful extends Dictionary<IStateful<any, any>>> = {
	[key in keyof TCompositeStateful]: TCompositeStateful[key]['state'];
};
export type ActionComposition<TCompositeStateful extends Dictionary<IStateful<any, any>>> = {
	[key in keyof TCompositeStateful]: TCompositeStateful[key]['actions'];
};

export type CompositeReducer<
	TState,
	TCompositeStateful extends Dictionary<IStateful<any, any>>,
	TArgs extends any[] = any[]
> = Dictionary<
	(
		state: {
			state: TState;
			underlyingState: StateComposition<TCompositeStateful>;
		},
		...args: TArgs
	) => Promise<TState>
>;

export type CompositeStatfulActions<
	TCompositeStateful extends Dictionary<IStateful<any, any>>,
	TState = StateComposition<TCompositeStateful>,
	TReducers extends CompositeReducer<TState, TCompositeStateful> = never
> = {
	actions: Actions<TReducers>;
	underlyingActions: ActionComposition<TCompositeStateful>;
};

export class CompositeStateful<
	TCompositeStateful extends Dictionary<IStateful<any, any>>,
	TState = StateComposition<TCompositeStateful>,
	TReducers extends CompositeReducer<TState, TCompositeStateful> = never
> implements IStateful<TState, CompositeStatfulActions<TCompositeStateful, TState, TReducers>>
{
	constructor(
		compositeStateful: TCompositeStateful,
		state: TState,
		mapState: (
			state: TState,
			compositeState: StateComposition<TCompositeStateful>
		) => Promise<TState>,
		reducers: TReducers
	) {
		this.stateChangedEvent = new PromiseEventDispatcher<
			typeof this,
			IStateChangedEventArgs<TState>
		>();
		this.compositeStateful = compositeStateful;
		this.mapState = mapState;
		const actions = Object.fromEntries(
			Object.entries(reducers ?? {}).map(([key, reducer]) => {
				return [
					key,
					async (args: Tail<Parameters<typeof reducer>>) => {
						const previousState = this.state;
						const state = await reducer(
							{ state: this.state, underlyingState: this.buildCompositeState() },
							args
						);
						if (state !== this.state) {
							this.state = state;
							await this.onStateChanged({ state, previousState });
						}
						return state;
					},
				];
			})
		) as any;
		this.actions = { actions, underlyingActions: this.buildActions() };
		this.stateChanged = this.stateChangedEvent.asEvent();
		this.state = state;
		for (let key in this.compositeStateful) {
			this.compositeStateful[key].stateChanged.subscribe(this.onSubStateChanged);
		}
	}
	protected async onStateChanged(stateChangedEventArgs: IStateChangedEventArgs<TState>) {
		await this.stateChangedEvent.dispatch(this, stateChangedEventArgs);
	}
	protected stateChangedEvent: PromiseEventDispatcher<this, IStateChangedEventArgs<TState>>;
	public stateChanged: IPromiseEvent<
		IStateful<TState, CompositeStatfulActions<TCompositeStateful, TState, TReducers>>,
		IStateChangedEventArgs<TState>
	>;
	public state: TState;
	public actions: CompositeStatfulActions<TCompositeStateful, TState, TReducers>;
	protected compositeStateful: TCompositeStateful;
	protected buildCompositeState() {
		return Object.fromEntries(
			Object.entries(this.compositeStateful).map(([key, stateful]) => [key, stateful.state])
		) as StateComposition<TCompositeStateful>;
	}
	protected buildActions() {
		return Object.fromEntries(
			Object.entries(this.compositeStateful).map(([key, stateful]) => [key, stateful.actions])
		) as StateComposition<TCompositeStateful>;
	}
	protected mapState: (
		state: TState,
		compositeState: StateComposition<TCompositeStateful>
	) => Promise<TState>;
	protected onSubStateChanged = (async (
		sender: IStateful<any, any>,
		args: IStateChangedEventArgs<any>
	) => {
		const previousState = this.state;
		this.state = await this.mapState(this.state, this.buildCompositeState());
		await this.onStateChanged({ previousState, state: this.state });
	}).bind(this);
	protected dispose() {
		for (let key in this.compositeStateful) {
			this.compositeStateful[key].stateChanged.unsubscribe(this.onSubStateChanged);
		}
	}
}
