import Watcher from "./watcher";

export default class Model {

    constructor(data: object,fn:Function) {
        
        let proxy = new Proxy(data, {
            set: (src: any, key: string, value: any, receiver: any) => {

                //值未变,proxy 不处理
                if (src[key] === value) {
                    return true;
                }
                //不处理原型属性 
                let excludes = ['__proto__', 'constructor'];

                if (excludes.includes(<string>key)) {
                    return true;
                }
                ;

                if (key != '$watch') {
                    Watcher.update(key,fn);
                }

                return Reflect.set(src, key, value, receiver);
            },
            get: (src: any, key: string | symbol, receiver) => {
                let res = Reflect.get(src, key, receiver);

                let data = ModelManager.getFromDataMap(src[key]);
                if (data) {
                    return data;
                }
                if (typeof res === 'object' && res !== null) {
                    if (!src[key].$watch) {
                        let p = new Model(res,fn);
                        return p;
                    }
                }
                return res;
            },
            deleteProperty: function (src: any, key: any) {
                if (src[key] != null && typeof src[key] === 'object') {
                    ModelManager.delToDataMap(src[key]);
                }
                delete src[key];
                return true;
            }
        });
        proxy.$watch = true;

        ModelManager.addToDataMap(data, proxy);

        return proxy;
    }

}

class ModelManager {
    private static dataMap: WeakMap<object, Model> = new WeakMap();

    static addToDataMap(data: any, proxy: any) {
        this.dataMap.set(data, proxy);
    }

    static delToDataMap(data: any) {
        this.dataMap.delete(data);
    }

    static getFromDataMap(data: any) {
        return this.dataMap.get(data);
    }
}
