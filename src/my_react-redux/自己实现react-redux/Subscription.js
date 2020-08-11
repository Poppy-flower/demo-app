//Subscription对应得源码地址： https://github.com/reduxjs/react-redux/blob/master/src/utils/Subscription.js



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


export default class Subscription{
    constructor(store, parentSub){
        this.store = store;
        this.parentSub = parentSub;
        this.listeners = [];  //源码listeners 是用链表实现的，这里我们简单处理，用数组实现

        this.handleChangeWrapper = this.handleChangeWrapper.bind(this);
    }

    //子组件注册回调到Subscription上
    addNestedSub(listener){
        this.listeners.push(listener);
    }

    //执行子组件回调
    notifyNestedSubs(){
        const length = this.listeners.length;

        for(let i=0; i<length; i++){
            const callback = this.listeners[i];
            callback();
        }
    }

    //回调函数的包装
    handleChangeWrapper(){
        if(this.onStateChange){
            this.onStateChange();
        }
    }

    //注册回调函数
    //如果 parentSub 有值，就将回调注册到 parentSub上
    //如果 parentSub 没值，那当前组件就是根组件，回调注册到 redux store
    trySubscribe(){
        this.parentSub?
            this.parentSub.addNestedSub(this.handleChangeWrapper)
            : this.store.subscribe(this.handleChangeWrapper);
    }
}
