import Action from './types/action';
import { Reducer } from './types/reducer';
/**
 *
 * @param reducer A function to process your action state
 * @returns An object that controls your state repository
 */
export default function createStore(reducer: Reducer | object): {
    dispatch: (action: Action) => void;
    subscribe: (listener: () => void, key?: string | undefined) => () => void;
    getState: () => any;
    replace: (newReducer: Reducer) => any;
};
