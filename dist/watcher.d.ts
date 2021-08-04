export default class Watcher {
    static watchers: Array<Function>;
    static keyMap: Map<string, Array<Function>>;
    static isExec: boolean;
    static update(key: string, fn: Function): void;
    static remove(fn: Function, key?: string): void;
    static add(fn: Function, key?: string): void;
    private static watchSelect;
}
