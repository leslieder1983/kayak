import Action, { AnyAction } from './action';
export declare type Reducer<State = any, A extends Action = AnyAction> = (state: State | undefined, action: A) => State;
export declare type ReducersObject<State = any, A extends Action = AnyAction> = {
    [K in keyof State]: Reducer<State[K], A>;
};
export declare type StateObject<Obj> = Obj extends ReducersObject ? {
    [P in keyof Obj]: Obj[P] extends Reducer<infer State, any> ? State : never;
} : never;
