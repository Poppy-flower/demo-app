import React, {useContext} from 'react';
import ReactReduxContext from './Context';

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
 *    这里添加的回调就是 检查给 WrappedComponent 组件的 props有没有发生变化；有变化就重新渲染，否则不渲染；
 * 所以，我们要解决两个问题：
 *    1. 当我们state变化的时候检查 最终给到 ConnectFunction 的参数有没有变化；
 *    2. 如果这个参数有变化，我们需要重新渲染 ConnectFunction；
 *
 * 检查参数变化：
 *    记录上次的参数 记录本次的参数， 二者比较， 得出变化没有。
 *    记录上次的参数： 我们直接在 ConnectFunction 里面使用 useRef 将上次渲染的参数记录下来。
 */
function connect(mapStateToProps, mapDispatchToProps){
    return function connectHOC(WrappedComponent){
        function ConnectFunction(props){
            let {...wrapperProps} = props;  //复制一份props到wrapperProps

            const context = useContext(ReactReduxContext);  //提取context,解构出store,获取state
            const {store} = context;
            const state = store.getState();

            const stateProps = mapStateToProps(state);  //执行mapStateToProps、mapStateToProps
            const dispatchProps = mapStateToProps(store.dispatch);

            const actualChildProps = Object.assign({}, wrapperProps, stateProps, dispatchProps);  //组装最终实际的props

            return (<WrappedComponent {...actualChildProps}/>);  //渲染WrappedComponent
        }
        return ConnectFunction;
    }
}

export default connect;
