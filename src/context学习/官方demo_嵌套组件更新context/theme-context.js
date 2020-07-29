import React from 'react';
export const theme = {
    light: {
        foreground: '#000000',  //前景
        background: '#eeeeee',  //背景
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
    }
};

export const ThemeContext = React.createContext({
    theme: theme.dark,
    toggleTheme : ()=>{}
});  //默认值-黑暗的

