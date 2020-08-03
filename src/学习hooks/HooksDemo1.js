import React, {useEffect, useState} from "react";

/**
 * useCallback:
 *
 *
 */

const HooksDemo = ()=>{
    let getInitialState = ()=>{
        console.log(11111);  //只会执行一次
        return 100;
    };

    // let [count, setCount] = useState(0);
    let [count, setCount] = useState(getInitialState);  //[state, 更新state的方法] ------ useState(initialState)

    useEffect(()=>{
        console.log('useEffect调用');
        return ()=>{
            console.log('组件卸载前执行');
        };
    }, [count]);

    return (<div>
        <button onClick={()=>{setCount(count+1)}}> + </button>
        {count}
        <button onClick={()=>{setCount(count-1)}}> - </button>
    </div>)
};

export default HooksDemo;
