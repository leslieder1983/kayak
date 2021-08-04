export default  interface Action<Type = any>{
    type:Type
}
export interface AnyAction extends Action {
    // Allows any extra properties to be defined in an action.
     [extraProps: string]: any
  }