import React, {useContext, useRef, useLayoutEffect, useReducer} from 'react';
import ReactReduxContext from './Context';
import shallowEqual from './shallowEqual';
import Subscription from './Subscription';

/**
 * connect 是react-redux的最难的部分
 * 首先，我们实现具有基本功能的 connect


function connect(mapStateToProps, mapDispatchToProps){
    return function connectHOC(WrappedComponent){
        function ConnectFunction(props){
            let {...wrapperProps} = props;  //复制一份props到wrapperProps

            const context = useContext(ReactReduxContext);  //提取context,解构出store,获取state
            const {store} = context;
            const state = store.getState();

            const stateProps = mapStateToProps(state);  //执行mapStateToProps、mapStateToProps
            const dispatchProps = mapStateToProps(store.dispatch);

            const actualChildProps = Object.assign({}, wrapperProps, stateProps, dispatchProps);  //组装最终的props

            return (<WrappedComponent {...actualChildProps}/>);  //渲染WrappedComponent
        }
        return ConnectFunction;
    }
}
 */

/**
 * 再来实现 state改了之后， 组件的更新功能，
 * 上面的可以实现渲染页面，但是点击按钮没反应，是因为点击按钮虽然改了state，但是并没有将变化反映在页面上，也就是组件没更新；
 * 那怎么让组件更新呢？
 *    store.subscribe()可以监听state变化，添加回调；
 *    这里添加的回调就是 检查给 WrappedComponent 组件的 props有没有发生变化；有变化就重新渲染ConnectFunction，否则不渲染；
 * 所以，我们要解决两个问题：
 *    1. 当我们state变化的时候检查 最终给到 ConnectFunction 的参数有没有变化；
 *    2. 如果这个参数有变化，我们需要重新渲染 ConnectFunction；
 *
 * 检查参数变化：
 *    记录上次的参数 记录本次的参数， 二者比较， 得出变化没有。
 *
 *    如何记录上次的参数： 我们直接在 ConnectFunction 里面使用 useRef 将上次渲染的参数记录下来。
 *    记录上次渲染参数，注意lastChildProps.current 是在第一次渲染结束后赋值，而且需要使用useLayoutEffect来保证渲染结束后立即同步执行。
      const lastChildProps = useRef();
      useLayoutEffect(()=>{
          lastChildProps.current = actualChildProps;
      }, []);
 *
 *    因为我们检测参数变化是需要重新计算 actualChildProps， 计算的逻辑是一样的，所以我们将这块计算逻辑抽出来，成为一个单独的方法 childPropsSelector（子组件props转换器）:
 *
 *    然后就是注册store的回调，在里面来检测参数是否变了，如果变了就强制更新当前组件，
 *    对比两个对象是否相等，react-redux采用的是 shallowEqual，也就是浅比较，也就是只对比一层，如果你mapStateToProps返回多层，比如：
 *    {
 *        stateA: {
 *          value: 1
 *        }
 *    }
 *    去改了 stateA.value是不会触发渲染的，react-redux之所以这么做，应该是也考虑了性能问题，如果深比较，比如递归去比较，比较浪费性能，而且有循环引用还可能造成死循环。
 *    采用前比较就比较遵循这种范式，不要穿入多层结构，这点在官方文档有说明。
 *
 * 强制更新：
 *    要强制更新组件的方法不止一个，
 *       class组件，可以直接this.setState()触发更新，老版本的react-redux就是这么干的；
 *       新版的react-redux重写了，使用了hook,那我们也可以使用react提供的 useReducer 或者 useState hook,react-redux源码用了useReducer,为了跟他保持一致，我们也用useReducer;
 *
 * 总结：
 *    connect代码主要对应的是源码中的 connectAdvanced这个类，基本原理和结构跟我们这个是一样的，只是他的更灵活，
 *    支持用户传入自定义的 childPropsSelector和合并stateProps、dispatchProps、wrapperProps的方法。
 *    源码链接： https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js
 *     到这里，其实我们已经可以用我们自己的react-redux替换官方的了，计数器的功能也是支持了。但是还要讲一下 react-redux是如何保证组件的更新顺序的，因为源码中很多代码都在处理这个。

function storeStateUpdatesReducer(count){
    return count+1;
}

function connect(mapStateToProps, mapDispatchToProps){
    //childPropsSelector
    function childPropsSelector(store, wrapperProps){
        const state = store.getState();  //拿到state

        //执行mapStateToProps mapDispatchToProps
        const stateProps = mapStateToProps(state);
        const dispatchProps = mapDispatchToProps(store.dispatch);

        return Object.assign({}, stateProps, dispatchProps, wrapperProps);
    }

    return function connectHOC(WrappedComponent){
        function ConnectFunction(props){
            let {...wrapperProps} = props;  //复制一份props到wrapperProps

            //记录上次渲染参数
            const lastChildProps = useRef();
            useLayoutEffect(()=>{
                lastChildProps.current = actualChildProps;
            }, []);

            const context = useContext(ReactReduxContext);  //提取context,解构出store,获取state
            const {store} = context;

            //使用useReducer触发强制更新
            const [, forceComponentUpdateDispatch] = useReducer(storeStateUpdatesReducer, 0);

            //注册回调
            store.subscribe(()=>{
                const nextChildProps = childPropsSelector(store, wrapperProps);

                //如果参数变了，记录新的值到 lastChildProps 上
                //并且强制更新当前组件
                if(!shallowEqual(nextChildProps, lastChildProps.current)){
                    lastChildProps.current = nextChildProps;

                    //需要一个API来强制更新当前组件
                    forceComponentUpdateDispatch();
                }
            });

            const actualChildProps = childPropsSelector(store, wrapperProps);  //组装最终实际的props

            return (<WrappedComponent {...actualChildProps}/>);  //渲染WrappedComponent
        }
        return ConnectFunction;
    }
}
 */


/**
 * 保证组件更新顺序：
 *  前面我们的Counter组件 使用 connect 连接 redux store,假如他下面还有个子组件 也连接了 redux store, 我们就需要考虑他们的回调的执行顺序问题了。
 *
 *  react是单向数据流，参数都是父组件传给子组件，现在引入了 redux, 即使父子组件都引入了同一个变量count，但是子组件完全可以不从父组件去取值，而是直接从redux拿，
 *  这就打破了react的单项向数据流。
 *
 *  在父->子这种单向数据流中，肯定是父组件先更新，然后是参数传给子组件再更新，但是在redux中，数据变成了 redux->父，redux->子，
 *  父与子完全可以根据redux的数据进行独立更新，而不能保证父级先更新，子级再更新的流程。
 *  所以 react-redux花了不少功夫来手动保证这个更新顺序，react-redux保证这个更新顺序的方案是在redux store外，再单独创建一个监听者类 Subscription(订阅)：
 *      1. Subscription 负责处理所有的 state 变化的回调；
 *      2. 如果当前连接redux 的组件是第一个连接redux的组件，也就是说他是连接redux的根组件，他的state回调直接注册到redux store;
 *         同时新建一个 Subscription 的实例 subscription 通过context传递给子级。
 *      3. 如果当前连接redux的组件 不是连接 redux 的根组件，也就是说他上面有组件已经注册到 redux store了，那么它可以直接拿传递下来的 subscription，
 *         源码里面这个变量叫 parentSub, 那当前组件的更新回调就注册到 parentSub上。
 *         同时，再新建一个 Subscription实例，替代 context上的 subscription,继续往下传，也就是说他的子组件的回调会注册到当前subscription上。
 *      4. 当 state 变化了，根组件注册到 redux store 上的回调会执行更新根组件，同时根组件需要手动执行子组件回调，子组件回调执行会触发子组件的更新，
 *         然后子组件再执行自己subscription上注册的回调，触发孙子组件更新，孙子组件再调用注册到自己subscription上的回调。。。
 *      这样就实现了从根组件开始，一层一层更新子组件的目的，保证 父->子 这样的更新顺序。
 */

/**
 * 改造connect：
 *  有了Subscription类， connect就不能连接到store了，而是应该注册到父级subscription上，更新的时候除了更新自己还要通知子组件更新。
 *  在渲染包裹的组件时，也不能直接渲染了，而是应该使用Context.Provider包裹一下，传入修改过的 contextValue，
 *  这个contextValue里面的 subscription应该替换为自己的。
 *
 */

function storeStateUpdatesReducer(count){
    return count+1;
}

function connect(mapStateToProps=()=>{}, mapDispatchToProps=()=>{}){
    //childPropsSelector
    function childPropsSelector(store, wrapperProps){
        const state = store.getState();  //拿到state

        //执行mapStateToProps mapDispatchToProps
        const stateProps = mapStateToProps(state);
        const dispatchProps = mapDispatchToProps(store.dispatch);

        return Object.assign({}, stateProps, dispatchProps, wrapperProps);
    }

    return function connectHOC(WrappedComponent){
        function ConnectFunction(props){
            let {...wrapperProps} = props;  //复制一份props到wrapperProps

            const contextValue = useContext(ReactReduxContext);  //提取context
            const {store, subscription: parentSub} = contextValue;  //解构出 store 和 subscription

            const actualChildProps = childPropsSelector(store, wrapperProps);  //组装最终实际的props

            //记录上次渲染参数
            const lastChildProps = useRef();
            useLayoutEffect(()=>{
                lastChildProps.current = actualChildProps;
            }, [actualChildProps]);

            //使用useReducer触发强制更新
            const [, forceComponentUpdateDispatch] = useReducer(storeStateUpdatesReducer, 0);

            //新建一个Subscription实例
            let subscription = new Subscription(store, parentSub);

            //state回调抽出来，成为一个方法
            const checkForUpdates = ()=>{
                let newChildProps = childPropsSelector(store, wrapperProps);

                //如果参数变了，记录新的值到 lastChildProps 上
                //并且强制更新当前组件
                if(!shallowEqual(newChildProps, lastChildProps.current)){
                    lastChildProps.current = newChildProps;

                    //需要一个API来强制更新当前组件
                    forceComponentUpdateDispatch();

                    //然后通知子组件更新
                    subscription.notifyNestedSubs();
                }
            };

            //使用 subscription 注册回调
            subscription.onStateChange = checkForUpdates;
            subscription.trySubscribe();

            //修改传给子级的context，将subscription改成自己的
            const overriddenContextValue = {
                ...contextValue,
                subscription
            };

            //渲染WrappedComponent
            //再次使用 ReactReduxContext包裹，传入修改过的context
            return (
                <ReactReduxContext.Provider value={overriddenContextValue}>
                    <WrappedComponent {...actualChildProps}/>
                </ReactReduxContext.Provider>
            );  //渲染WrappedComponent
        }
        return ConnectFunction;
    }
}

export default connect;
