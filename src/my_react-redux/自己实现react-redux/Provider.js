import React from 'react';
import ReactReduxContext from './Context';

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

export default Provider;
