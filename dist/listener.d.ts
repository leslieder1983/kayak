export default class Listener {
    static watchers: Array<Function>;
    static keyMap: Map<string, Array<Function>>;
    static isExec: boolean;
    static update(key?: string): void;
    static remove(fn: Function, key?: string): void;
    static add(fn: Function, key?: string): void;
    private static watchSelect;
}
