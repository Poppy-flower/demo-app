import React, {Component} from 'react';

const ThemeContext = React.createContext('light');  //主题context

const UserContext = React.createContext({name: 'Gueat'});  //用户context

class App extends Component {
    render() {
        let {signedInUser, theme} = this.props;

        // 提供初始 context 值的 App 组件
        return (
            <ThemeContext.Provider value={theme}>
                <UserContext.Provider value={signedInUser}>
                    <Layout/>
                </UserContext.Provider>
            </ThemeContext.Provider>

        )
    }
}

function Layout(){
    return (
        <div>
            <Sidebar/>
            <Content/>
        </div>
    )
}

// 一个组件可能会消费多个 context
function Content() {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <UserContext.Consumer>
                    {user => (
                        <ProfilePage user={user} theme={theme} />
                    )}
                </UserContext.Consumer>
            )}
        </ThemeContext.Consumer>
    );
}

function Sidebar() {
    return (
        <div>Sidebar</div>
    )
}

function ProfilePage(props) {
    let {user, theme} = props;

    return (
        <>
            <div>Content</div>
            <div className="page">user:{user},theme:{theme}</div>
        </>
    )
}

export default App;
