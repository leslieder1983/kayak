import ActionTypes from "./util/actions"
import { Reducer, ReducersObject, StateObject } from "./types/reducer"
import { AnyAction } from "./types/action"
export default function combineReducers(reducers: ReducersObject | any): Reducer {
  const reducerKeys = Object.keys(reducers);
  const combineReducers: ReducersObject = {};

  for (let i = 0; i < reducerKeys.length; i++) {
    const key:string = reducerKeys[i]

    if (typeof reducers[key] === 'function') {
      combineReducers[key] = reducers[key]
    } else {
      throw new Error(`${key}对应的reducer不是函数，请确保${reducers[key]}为函数,
                      Please ensure that the reducer you provide is a function
        `);
    }
  }
  const combineKeys = Object.keys(combineReducers);


  let shapeAssertionError: Error
  try {
    assertReducerShape(combineReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  return function (
    state: StateObject<typeof reducers> = {},
    action: AnyAction,
  ) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    for (let i = 0; i < combineKeys.length; i++) {
      const key = combineKeys[i]
      const reducer = combineReducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const actionType = action && action.type
        throw new Error(
          `When called with an action of type ${actionType ? `"${String(actionType)}"` : '(unknown type)'
          }, the slice reducer for key "${key}" returned undefined. ` +
          `To ignore an action, you must explicitly return the previous state. ` +
          `If you want this reducer to hold no value, you can return null instead of undefined.`
        )
      }

      state[key] = nextStateForKey;
    }

  }
}
function assertReducerShape(reducers: ReducersObject) {
  Object.keys(reducers).forEach(key => {
    const reducer = reducers[key]
    const initialState = reducer(undefined, { type: ActionTypes.INIT })

    if (typeof initialState === 'undefined') {
      throw new Error(
        `The slice reducer for key "${key}" returned undefined during initialization. ` +
        `If the state passed to the reducer is undefined, you must ` +
        `explicitly return the initial state. The initial state may ` +
        `not be undefined. If you don't want to set a value for this reducer, ` +
        `you can use null instead of undefined.`
      )
    }

    if (
      typeof reducer(undefined, {
        type: ActionTypes.INIT + '1'
      }) === 'undefined'
    ) {
      throw new Error(
        `The slice reducer for key "${key}" returned undefined when probed with a random type. ` +
        `Don't try to handle '${ActionTypes.INIT}' or other actions in "redux/*" ` +
        `namespace. They are considered private. Instead, you must return the ` +
        `current state for any unknown actions, unless it is undefined, ` +
        `in which case you must return the initial state, regardless of the ` +
        `action type. The initial state may not be undefined, but can be null.`
      )
    }
  })
}