
export default function clone(proxy: object,...exc:Array<string>) :object {

    let ds: Array<string> = Object.getOwnPropertyNames(proxy);
    let res = new Object();
    for (let i = 0; i < ds.length; i++) {
        if (proxy.hasOwnProperty(ds[i])&&ds[i]!=='$watch'&&!exc.includes(ds[i])) {
            let param = Reflect.get(proxy, ds[i]);
            Object.defineProperty(res, ds[i], {
                value: function () {
                    if (typeof param === 'object' && param !== null) {
                        return clone(param)
                    } else {
                        return param
                    }
                }(),
                enumerable:true
            })
        }
    }
    return res;
}