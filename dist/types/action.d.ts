export default interface Action<Type = any> {
    type: Type;
}
export interface AnyAction extends Action {
    [extraProps: string]: any;
}
