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

/**
 * 总结：
 *       1. React-Redux 是连接react 和 redux 的库， 同时使用了 react 和 redux 的API。
 *       2. react-redux主要使用了 react的 context API传递 store。
 *       3. Provider的作用是 接收 redux store ,然后放到context上传下去.
 *       4. connect 作用是 从redux store 中选取 需要的属性 传递给包裹的组件。
 *       5. connect 会自己判断是否需要更新， 判断的依据是需要的state是否已经变化了。
 *       6. connect 判断是否变化的时候用的是浅比较，也就是只比较一层，所以 在使用mapStateToProps和 mapDispatchToProps 不要返回多层嵌套的对象。
 *       7. 为了解决父组件和子组件 各自独立依赖 Redux,破坏了 React 的 父级->子级的更新流程，react-redux 使用 Subscription 类自己管理了一套通知流程。
 *       8. 只有连接redux最顶级的组件才会直接注册到store，其他子组件都会注册到最近父组件的 subscription 实例上。
 *       9. 通知的时候从根组件开始 依次通知自己的子组件，子组件接收到通知，先更新自己再通知自己的子组件。
 */



