import React, {Component} from 'react';
import {theme, ThemeContext} from "./theme-context";
import ThemedButton from './themed-button';

function Toolbar(props){
    return (
        <ThemedButton onClick={props.changeTheme}>
            change theme
        </ThemedButton>
    );
}

class App extends Component{
    constructor(props){
        super(props);

        this.state = {
            theme: theme.light,
        }
    }

    toggleTheme = ()=>{
        this.setState({
            theme: (this.state.theme === theme.dark)? theme.light : theme.dark
        });
    };

    render (){
        return (
            <>
                <ThemeContext.Provider value={this.state.theme}>
                    <Toolbar changeTheme={this.toggleTheme}></Toolbar>
                </ThemeContext.Provider>
                <section>
                    <ThemedButton>默认主题的按钮</ThemedButton>
                </section>
            </>
        );
    }
}

export default App;
