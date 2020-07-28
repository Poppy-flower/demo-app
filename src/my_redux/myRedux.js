/**
 * createStore(reducer) ====> store
 * store:
 *     -getState: 返回state
 *     -subscribe: 订阅state的变化，当state变化的时候执行回调，可以有多个subscribe，里面的回调会依次执行
 *     -dispatch: 发出action的方法，每次dispatch action 都会执行reduce人，产生新的state，然后执行subscribe注册的回调。
 *
 * 思考：
 *     subscribe 注册回调，dispatch触发回调，这不就是发布订阅模式么？
 */

//简单版
// export function createStore(reducer){
//     let state;  //state记录所有状态
//     let listeners = [];  //listeners保存所有注册的回调
//
//     function subscribe(callback){  //subscribe就是将所有的回调保存下来
//         listeners.push(callback);
//     }
//
//     function dispatch(action){  //dispatch就是将所有的回调都拿出来执行
//         state = reducer(state, action);  //每次dispatch触发回调之前，都要先执行reducer修改state
//
//         for(let i=0, l=listeners.length; i<l; i++){
//             const listener = listeners[i];
//             listener();
//         }
//     }
//
//     function getState(){  //getState直接返回state
//         return state;
//     }
//
//     const store =  {  //store包装一下前面的方法，直接返回
//         getState,
//         subscribe,
//         dispatch
//     };
//
//     return store;
// }


/**
 * 手写combineReducer(reducerMap)
 * 参数:
 * {
 *  state1: reducer1,
 *  state2: reducer2
 * }
 * 返回值：
 * reducer
 * 首先返回值是一个reducer,也可以传入createStore, 这说明 生成的reducer 结构跟之前一样，都是一个函数： （state, action）=>newState
 * 但是，这个state，要符合combineReducer参数的数据结构
 */

export function combineReducers(reducerMap){
    const reducerKeys = Object.keys(reducerMap);  //先把所有的key拿出来

    let reducer = (state = {}, action)=>{
        const newState = {};

        for(let i=0, l=reducerKeys.length; i<l; i++){
            let key = reducerKeys[i];
            let currentReducer = reducerMap[key];
            let prevState = state[key];

            newState[key] = currentReducer(prevState, action);
        }

        return newState;
    };

    return reducer;
};

//createStore: 支持enhancer版本
export function createStore(reducer, enhancer){  //接受第二个参数 enhancer
    /**
     * 先处理enhancer：
     * 如果enhancer存在且是个函数
     *  1. 我们将createStore作为参数，传给enhancer；enhancer应该返回一个新的 createStore给我们
     *  2. 我们再拿新的createStore执行，应该得到一个store
     *  3. 直接返回这个store
     * 如果没有enhancer，就执行之前的函数逻辑
     */
    if(enhancer && typeof enhancer === 'function'){
        const newCreatorStore = enhancer(createStore);
        const newStore = newCreatorStore(reducer);
        return newStore;
    }

    let state;  //state记录所有状态
    let listeners = [];  //listeners保存所有注册的回调

    function subscribe(callback){  //subscribe就是将所有的回调保存下来
        listeners.push(callback);
    }

    function dispatch(action){  //dispatch就是将所有的回调都拿出来执行
        state = reducer(state, action);  //每次dispatch触发回调之前，都要先执行reducer修改state

        for(let i=0, l=listeners.length; i<l; i++){
            const listener = listeners[i];
            listener();
        }
    }

    function getState(){  //getState直接返回state
        return state;
    }

    const store =  {  //store包装一下前面的方法，直接返回
        getState,
        subscribe,
        dispatch
    };

    return store;
}

/**
 * 手写 applyMiddleware的大致框架
 * 返回值： 一个enhancer
 * enhancer的基本结构，type enhancer: （next:StoreCreator）=>{StoreCreator}
 * applyMiddleware传给 createStore是作为第二个参数，所以它是一个enhancer，但是准确的说，他的返回值才是一个enhancer，因为传的第二个参数是applyMiddleware()

export function applyMiddleware(middleware){
    function enhancer(createStore){
        function newCreateStore(reducer){
            const store = createStore(reducer);
            return store;
        }

        return newCreateStore;
    }

    return enhancer;
}

*/

/**
 * 实现applyMiddleware(middleware)的功能,支持一个中间件
 * 回想：
 *  logger next(action)改了state，但是只有dispatch（action）才会改state，所以 next 就是 dispatch
 *  logger 返回值是 return function(action){},它的参数是action 而不是 dispatch(action),
 *      其实他就是 新的dispatch(action),这个新的dispatch(action)会调用原来的dispatch，并在调用的前后加上自己的逻辑。
 *  所以这里，中间件的结构也清楚了：
 *      1. 一个中间件接受一个store作为参数，返回一个函数
 *      2. 返回的这个函数接收老的dispatch函数作为参数，返回一个新函数
 *      3. 返回的新函数，就是新的dispatch函数，这个函数里面可以拿到外面两层传进来的store 、 老的dispatch函数
 *  所以，说白了，中间件就是加强dispatch的功能，用新的dispatch替代老的dispatch，这就是 装饰器模式。
 *      其实前面enhancer也是装饰器模式，传入createStore， 在createStore执行前后加上一些代码，最后又返回一个加强版的createStore。
 *  遵循这个思路，我们的applyMiddleware就可以写出来了：
 */

// export function applyMiddleware(middleware){
//     function enhancer(createStore){
//         function newCreateStore(reducer){
//             const store = createStore(reducer);
//
//             //将middleware拿过来执行以下，得到第一层函数
//             let func = middleware(store);
//
//             //结构出最原始的dispatch
//             let {dispatch} = store;
//
//             //将原始的dispatch传入func,执行后得到加强版的dispatch
//             let newDispatch = func(dispatch);
//
//             //返回的时候，用新的dispatch替代老的
//             return {...store, dispatch: newDispatch};
//         }
//
//         return newCreateStore;
//     }
//
//     return enhancer;
// }


/**
 * applyMiddleware 支持多个middleware
 * 要实现这个，跟单个的相比，我们返回的newDispatch,依次将传入的middleware拿出来执行就行，多个函数的串行执行，可以用compose辅助函数
 */
function compose(...funcs){
    return funcs.reduce((a, b) =>(...args) => a(b(...args)));
}
export function applyMiddleware(...middlewares){
    function enhancer(createStore){
        function newCreateStore(reducer){
            const store = createStore(reducer);

            //多个middleware， 先解构出 dispatch=>newDispatch 结构
            let chain = middlewares.map(middleware=> middleware(store));

            //结构出最原始的dispatch
            let { dispatch } = store;

            //用compose 执行，得到一个组合了所有newDispatch的函数,执行这个函数，得到newDispatch
            let newDispatchGen = compose(...chain);
            let newDispatch = newDispatchGen(dispatch);

            //返回的时候，用新的dispatch替代老的
            return {...store, dispatch: newDispatch};
        }

        return newCreateStore;
    }

    return enhancer;
}











