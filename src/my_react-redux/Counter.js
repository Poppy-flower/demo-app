import React from 'react';
// import { connect } from 'react-redux';
import {connect} from './自己实现react-redux';
import { increment, decrement, reset } from './actions';

function Counter(props) {
    const {
        count,
        incrementHandler,
        decrementHandler,
        resetHandler
    } = props;

    return (
        <>
            <h3>Count: {count}</h3>
            <button onClick={incrementHandler}>计数+1</button>
            <button onClick={decrementHandler}>计数-1</button>
            <button onClick={resetHandler}>重置</button>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        count: state.count
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        incrementHandler: () => dispatch(increment()),
        decrementHandler: () => dispatch(decrement()),
        resetHandler: () => dispatch(reset()),
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Counter)
