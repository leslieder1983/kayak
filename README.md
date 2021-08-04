# Kayak

Kayak is a state management pattern developed for applications. It uses centralized storage to manage the state of all components of the application, and uses corresponding rules to ensure that the state changes in a predictable way

Kayak 是一个专门针对应用程序开发的状态管理工具。它采用集中式存储管理需要用户共享的所有状态，并以相应的规则保证状态以一种可预测的方式发生变化。  
Kayak 通常应用于SPA开发过程中。例如主流的前端框架React,Vue,Angular 等。  
kayak 诞生于另一 MVVM 框架团队--Nodom。  
未来,Nodom 将会整合团队自主开发的：后端框架 Noomi，ORM 框架 Relaen,轻松的构建一体化项目。

## 什么情况下用它？

kayak 可以帮助我们管理共享状态，并附带了更多的概念。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Kayak 可能是不必要的。如果您的应用够简单，您最好不要使用 Kayak。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为良好的的选择。如果你还不知道什么时候使用合适，当你尝试过后就知道了。

## Kayak 的工作流程

### 起步

- 你可以通过下载 dist 目录下的 kayak.js 引入。以 script 标签的方式引入。
- npm引入  
  
模块化开发初始化
```js
import kayak from 'kayak'
const add=function(preState=0,action){
const {type,data}=action;
switch(type){
    case 'add':return preState+data;
    default return preState;
}
}
const store=kayak(add);
```
## 开始
kayak来帮助创建你的store,保证你的“store”唯一。store基本上就是一个容器，它包含着你的应用中大部分的状态 (state);
```js
    const store = kayak(add);
        function add(pre = 0, action) {
            const {
                type,
                data
            } = action;
            switch (type) {
                case 'add':
                    return pre + 1;
                default:
                    return pre;
            }
        }
```

    当你需要更新状态时：
```js
    store.dispatch({
        type:'add',
        /**
         * dispatch需要传入一个对象，type字段是必须的，其余字段非必须传入
         * **/
        data:1，
    });
```

    当你需要监听状态值改变时,订阅即可：
```js
     const unScribe = store.subscribe(() => {
            console.log('这是订阅后执行的回调函数，
             你可以在这里进行组件/模块更新的操作');
        });

```
     subscribe执行后会返回一个unsubscribe函数，调用即可取消订阅。
```js
    unScribe()
```
    subscribe第二个参数来对单个属性进行订阅，如果传入第二个参数，  
    只有store的该字段数据改变后才执行回调。
```js
    store.subscribe(() => {
            console.log('这是只订阅add字段的更新，执行的回调函数');
        },'add');
```

    当你需要获取store存储的数据时，调用getState即可。
    不要尝试直接修改数据，改变 store 中的状态的唯一途径就是store.dispatch()。  
    这样使得我们可以方便地跟踪每一个状态的变化。
```js
    let data=store.getState();
```
### 多个state
传入kayak函数的参数需为一个对象。  
对象的属性名对应该属性的处理函数Reducer.   
kayak只能拥有一个处理函数Reducer,它会帮你合并多个reducer.  
你只需以对象键值的形式传入即可。  

```js
  function add(pre = 0, action) {
            const {
                type,
                data
            } = action;
            switch (type) {
                case 'add':
                    return pre + 1;
                default:
                    return pre;
            }
        }

        function del(pre = {}, action) {
            const {
                type,
                data
            } = action;
            switch (type) {
                case 'del':
                    return {
                        name:Math.random()*10|0
                    };
                    case 'addUser':
                        pre.num++;
                        return ;
                default:
                    return pre;
            }
        }
        function arr(pre=[],action){
            const {
                type,
                data
            } = action;
            switch (type) {
                case 'push':
                    pre.push(data);
                    return pre;
                default:
                    return pre;
            }
        }
        这样即可：
        const store = kayak({  
            add:add,  
            del:del,
            arr:arr
        });
        如果属性名和函数名一样也可简写：
        const store = kayak({  
            add,  
            del,
            arr
        });
```
### Action
更新store状态时，只能通过dispatch方法，而在调用该方法时传入的是Action对象。执行更新方法的Reducer第二个参数也是该Action对象。  
可以直接传入:  
```js
store.dispatch({
    type：'addUser',
    data:{id:1,name:'kyle'}
})
```
也可封装函数调用
```js
function addUser(name){
    return {
        type:'addUser'
        data:name
    }
}
store.dispatch(addUser('kyle'))
```
  
### Reducer
1. 用于初始化状态、加工状态。初始化store时会调用一次，确保传入undefined时reducer函数会返回初始值，建议设置默认参数即可。  

2. 加工时，根据旧的state和action， 产生新的state，可以直接改变传入的先前state.  
3. kayak不需要reducer是一个纯函数，内部使用proxy对数据进行了代理监听。如果对应的state是对象,改变旧的state即可。

### Store
1 getState(): 得到state

2 dispatch(action): 分发action, 触发reducer调用, 产生新的state

3 subscribe(listener,key?): 注册监听, 当产生了新的state时, 自动调用。    
key:多个reducer函数时，可以指定某单项数据监听，只有该数据项改变时才会执行回调。  
不指定则任意数据改变均会触发回调函数。  
4 replace():替换reducer函数
```js
function del(pre = {}, action) {
            const {
                type,
                data
            } = action;
            switch (type) {
                case 'del':
                    return {
                        name:Math.random()*10|0
                    };
                    case 'addUser':
                        pre.num++;
                        return ;
                default:
                    return pre;
            }
        }
 store.replace(del);
```
 