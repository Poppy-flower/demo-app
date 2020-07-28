// import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createStore, combineReducers, applyMiddleware } from './myRedux';

const initMilkState = {
    milk: 0
};

function milkReducer(state = initMilkState, action){
    switch(action.type){
        case 'PUT_MILK':
            return {...state, milk: state.milk+action.count};
        case 'TAKE_MILK':
            return {...state, milk: state.milk-action.count};
        default:
            return state;
    }
}

const initRiceState = {
    rice: 0
};

function riceReducer(state = initRiceState, action){
    switch(action.type){
        case 'PUT_RICE':
            return {...state, rice: state.rice+action.count};
        case 'TAKE_RICE':
            return {...state, rice: state.rice-action.count};
        default:
            return state;
    }
}

const logger = (store)=>{
    return function(next){
        return function(action){
            console.group(action.type);
            console.log('logger');
            console.info('dispatching', action);
            let result = next(action);
            console.log('next state', store.getState());
            console.groupEnd();
            return result;
        }
    }
};

const logger2 = (store)=>{
    return function(next){
        return function(action){
            console.log('logger2');
            let result = next(action);
            return result;
        }
    }
};

let reducer = combineReducers({
    milkState: milkReducer,
    riceState: riceReducer
});

let store = createStore(reducer, applyMiddleware(logger, logger2));

/**
 * subscribe 其实就是订阅store的变化, 一旦store发生改变，回调就会执行
 * 如果是结合页面刷新，那这个地方就是页面刷新
 */
store.subscribe(()=>{
    console.log('回调');
    console.log(store.getState())
});

// 将action发出去要用dispatch
store.dispatch({ type: 'PUT_MILK', count: 1 });    // {milkState: {milk:1}, riceState: {rice:0}}
store.dispatch({ type: 'PUT_MILK', count: 1 });    // {milkState: {milk:2}, riceState: {rice:0}}
store.dispatch({ type: 'TAKE_MILK', count: 1 });   // {milkState: {milk:1}, riceState: {rice:0}}
store.dispatch({ type: 'PUT_RICE', count: 1 });    // {milkState: {milk:1}, riceState: {rice:1}}
store.dispatch({ type: 'PUT_RICE', count: 5 });    // {milkState: {milk:1}, riceState: {rice:6}}
store.dispatch({ type: 'TAKE_RICE', count: 1 });   // {milkState: {milk:1}, riceState: {rice:5}}
