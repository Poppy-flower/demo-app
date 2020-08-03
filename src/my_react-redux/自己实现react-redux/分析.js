/**
 * 分析核心的2个API：
 * <Provider> 用来包裹根组件的 组件，作用是注入redux的store
 * connect 高阶函数，或者说高阶组件，作用是将state和dispatch注入给需要的组件，返回一个新组件
 *
 * 所以，react-redux的核心就是这两个API，而且两个都是组件，作用也很类似，都是往组件里面注入参数。
 * Provider往 根组件 注入store；
 * connect往 需要的组件 注入state和dispatch。
 *
 * 猜测：
 * Provider 其实就是封装了 Context.Provider,传递的store
 * connect HOC 其实就是封装了 Context.Customer 或者 useContext
 */



