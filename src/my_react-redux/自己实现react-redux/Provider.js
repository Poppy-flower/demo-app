import React, {useMemo, useEffect} from 'react';
import ReactReduxContext from './Context';
import Subscription from "./Subscription";

/**
 * 改造之前的Provider

function Provider(props){
    let {store, children} = props;

    let contextValue = {store};  //这是要传递的context

    //返回 ReactReduxContext.Provider 包裹的组件，传入contextValue,里面的内容直接是children，我们不动它
    return (
        <ReactReduxContext.Provider value={contextValue}>
            {children}
        </ReactReduxContext.Provider>
    );
}

 */

/**
 * 改造Provider：
 * 在我们自己实现的react-redux里面，根组件一直是Provider，所以Provider需要实例化一个 Subscription并且放到context里面，
 * 而且每次 state更新的时候，需要手动调用子组件回调
 */
function Provider(props){
    let {store, children} = props;

    //这是要传递的context，里面放入 store 和 subscription实例
    let contextValue = useMemo(()=>{
        const subscription = new Subscription(store);
        //注册回调为通知子组件，这样就可以开始层级通知了
        subscription.onStateChange = subscription.notifyNestedSubs;

        return {
            store,
            subscription
        }
    }, [store]);

    //拿到之前的state值
    const previousState = useMemo(()=>store.getState(), [store]);

    //每次contextValue 或者 previousState 变化的时候，用 notifyNestedSubs 通知子组件
    useEffect(()=>{
        const {subscription} = contextValue;
        subscription.trySubscribe();

        if(previousState !== store.getState){
            subscription.notifyNestedSubs();
        }
    }, [contextValue, previousState]);


    //返回 ReactReduxContext.Provider 包裹的组件，传入contextValue,里面的内容直接是children，我们不动它
    return (
        <ReactReduxContext.Provider value={contextValue}>
            {children}
        </ReactReduxContext.Provider>
    );
}

export default Provider;
