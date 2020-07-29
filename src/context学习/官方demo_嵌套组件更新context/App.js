import React, {Component} from 'react';
import {theme, ThemeContext} from "./theme-context";
import ThemeTogglerButton from './theme-toggler-button';

class App extends Component{
    constructor(props){
        super(props);

        this.toggleTheme = ()=>{
            this.setState({
                theme: (this.state.theme === theme.dark)? theme.light : theme.dark
            });
        };

        this.state = {
            theme: theme.light,
            toggleTheme: this.toggleTheme,
        }
    }

    render (){
        return (
            <>
                <ThemeContext.Provider value={this.state}>
                    <Content/>
                </ThemeContext.Provider>
            </>
        );
    }
}

function Content() {
    return (
        <div>
            <ThemeTogglerButton />
        </div>
    );
}


export default App;
