import React, {useState, useEffect, useContext} from 'react';

/**
 * state Hook：
 * 1. [state, 更新state的方法] ------ useState(参数)，参数可以使初始值，也可以是一个函数
 * 2. useState(initialState)，参数只会在组件的初始渲染中起作用
 *  参数：
 *  2.1 initialState是state初始值
 *  2.2 initialState是函数，函数返回值作为state初始值
 *  返回值：
 *  useState(参数)，返回一个数组，一个是当前state值，一个是更新当前state的方法
 *  这个setState方法 与 class中的setState不一样，这个不会合并state，所以需要多个state，需要调用多次 useState
 */


const HooksDemo = ()=>{
    let getInitialState = ()=>{
        console.log(11111);  //只会执行一次
        return 100;
    };

    // let [count, setCount] = useState(0);
    let [count, setCount] = useState(getInitialState);  //[state, 更新state的方法] ------ useState(initialState)

    return (<div>
        <button onClick={()=>{setCount(count+1)}}> + </button>
        {count}
        <button onClick={()=>{setCount(count-1)}}> - </button>
    </div>)
};

// export default HooksDemo;

/**
 * effect Hooks: useEffect是在每次组件渲染之后执行 ，可以理解为 componentDidMount componentDidUpdate
 * useEffect(参数一，参数二)
 * 参数一： 一个函数，可以里面再返回一个函数，也可以不返回；
 *         里面再返回函数的话，返回的函数在每次组件销毁之前执行；
 * 参数二：一个数组[],里面是props或者state都行
 *         只有数组里面的值变的时候，才会执行useEffect里的第一个参数函数；
 *         如果仅仅想让这个第一个参数函数在（1）第一次渲染完（2）组件最后销毁的时候执行，那么传空数组即可[]
 *
 */

const HooksDemo2 = ()=>{
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

// export default HooksDemo2;

const HooksDemo3 = ()=>{
    let [count, setCount] = useState(0);

    return (<div>
        <button onClick={()=>{setCount(count+1)}}> + </button>
        {count}
        <button onClick={()=>{setCount(count-1)}}> - </button>
    </div>)
};

export default HooksDemo3;