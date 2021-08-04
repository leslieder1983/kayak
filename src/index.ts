
import Action from './types/action';
import { Reducer } from './types/reducer';
import ActionTypes, { isObject } from './util/actions';
import Watcher from './watcher';
import Model from './model';
import combineReducers from './combineReducers';
import clone from './util/index';

/**
 * 
 * @param reducer A function to process your action state
 * @returns An object that controls your state repository
 */
export default function createStore(reducer: Reducer | object) {
    /**
     * Is the scheduling Reducer method being executed
     */
    let isDispatching: boolean = false;
    /**
     * 
     *  If there is only one reducer function, set the default value
     */
    let currentReducer = typeof reducer === 'function' ? reducer : combineReducers(reducer);
    /**
     *  
        初始化数据
        Initialization data
     */
    let data = {
        'currentState': undefined
    };
    /**
     * 初始化代理对象返回的proxy
     * Initializes the proxy returned by the proxy object
     */
    let proxy: any;

    let combine: boolean = typeof reducer === 'function' ? false : true;

    /**
     * 
     * @param action Action对象，要求传入type,
     *              Action object. Type is required
     */
    function dispatch(action: Action) {
        if (!isObject(action)) {
            throw new Error(
                `Actions must be a objects. Instead, the actual type was: '${typeof action}'`
            )
        }

        if (typeof action.type === 'undefined') {
            throw new Error(
                'Actions may not have an undefined "type" property. You may have misspelled an action type string constant.'
            )
        }

        let currentState = data.currentState;
        try {
            isDispatching = true
            if (combine) {
                currentReducer(proxy, action);
            } else {
                proxy['currentState'] = currentReducer(currentState, action);
            }
        } finally {
            isDispatching = false
        }
    }
    function subscribe(listener: () => void, key?: string) {
        if (typeof listener !== 'function') {
            throw new Error(
                `Expected the listener to be a function. Instead, received: '${typeof (
                    listener
                )}'`
            )
        }
        if (isDispatching) {
            throw new Error(
                'You may not call store.subscribe() while the reducer is executing. ' +
                'If you would like to be notified after the store has been updated, subscribe from a ' +
                'component and invoke store.getState() in the callback to access the latest state. ' +
                'See https://redux.js.org/api/store#subscribelistener for more details.'
            )
        }
        let isSubscribed = true;
        key !== undefined ? Watcher.add(listener, key) : Watcher.add(listener);
        return function unsubscribe() {
            if (!isSubscribed) {
                return
            }

            if (isDispatching) {
                throw new Error(
                    'You may not unsubscribe from a store listener while the reducer is executing. '
                )
            }
            Watcher.remove(listener, key);
            isSubscribed = false;
        }


    }
    function getState() {
        if (isDispatching) {
            throw new Error(
                'You may not call store.getState() while the reducer is executing. ' +
                'The reducer has already received the state as an argument. ' +
                'Pass it down from the top reducer instead of reading it from the store.' +
                'reducer还在执行中'
            )
        }
        /**
         * get clone object
         */
        const res: any = combine ? clone(data, 'currentState') : clone(data);

        return combine ? res : res['currentState'];
    }
    /**
     * 
     * @param newReducer A new Reducer replaces the original reducer function
     * @returns store
     */
    function replace(newReducer: Reducer) {
        if (typeof newReducer !== 'function') {
            throw new Error(
                `Expected the nextReducer to be a function. Instead, received: '${typeof
                newReducer
                }`
            )
        }
        currentReducer =newReducer;
        dispatch({ type: ActionTypes.REPLACE } as Action);
        
        return store;
    }
    function update(){
        isDispatching=false;
    }
    /**
     *   proxy Initialize data
     */
    
    proxy = new Model(data,update);
    /**
     * state get default data
     */
    dispatch({ type: ActionTypes.INIT } as Action);

    const store = {
        dispatch: dispatch,
        subscribe,
        getState,
        replace,
    }
    return store;
}