
export default class Watcher {
    static watchers: Array<Function> = [];
    static keyMap: Map<string, Array<Function>> = new Map();
    static isExec: boolean = false;
  
    public static async update(key: string,fn:Function): Promise<void> {
        if (this.isExec) {
            return;
        }
        this.isExec = true;
        let extra:Array<any>=[];
        if(key!==undefined ){
            extra=Watcher.keyMap.get(key)||[];
        }
        
        let watchers:Array<Function>=[...Watcher.watchers,...extra];
       await fn();
        watchers?.forEach(fn => fn());
        
        this.isExec=false;
    }
    static remove(fn: Function, key?: string) {
        let watchers:Array<Function>|undefined=this.watchSelect(key);
        watchers?.splice(watchers.indexOf(fn), 1);
    }
    static add(fn: Function, key?: string) {
        let watchers:Array<Function>|undefined=this.watchSelect(key);
        if (key && watchers === undefined) {
            this.keyMap.set(key, new Array());
            this.keyMap.get(key)?.push(fn);
        }
        watchers?.push(fn);
    }
    private static  watchSelect(key: string | undefined) {
        return key === undefined ? Watcher.watchers : Watcher.keyMap.get(key);
    }
}