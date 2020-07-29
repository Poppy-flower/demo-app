import React, {Component} from 'react';

//context 让我们无需明确的传遍每一层组件，就能将值传递进入整个组件树
//为当前的theme主题，创建一个context
const ThemeContext = React.createContext('light');

class ThemeButton extends Component{
    //指定contextType 读取当前的 theme context。
    //react 会往上找到最近的 theme Provider，然后使用他的值。
    //在这个例子中，当前的theme为 dark.

    static contextType = ThemeContext;

    render(){
        return (<Button theme={this.context}/>)
    }
}

function App() {
    //使用Provider 来将当前的theme 传递进整个组件树
    //无论多深，任何组件都能读取到这个值
    //在这个例子，我们将theme=dark 传递进去
    return (
        <ThemeContext.Provider value={'dark'}>
            <Toolbar/>
        </ThemeContext.Provider>
    );
}

function Toolbar(props){
    console.log(props);
    // console.log(ThemeContext);
    //无需再传递自己不用的props
    return <ThemeButton/>
};

function Button(props){
    let handleButton = ()=>{
        console.log(props.theme);
    };

    return <button onClick={handleButton}>按钮</button>
}


export default App;
