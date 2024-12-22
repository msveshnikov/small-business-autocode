import { createContext, useState, useContext, useCallback } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const ThemeContext = createContext();

const lightTheme = extendTheme({
    colors: {
        background: '#ffffff',
        text: '#333333',
        primary: '#3182ce',
        secondary: '#38b2ac'
    }
});

const darkTheme = extendTheme({
    colors: {
        background: '#1a202c',
        text: '#e2e8f0',
        primary: '#63b3ed',
        secondary: '#4fd1c5'
    }
});

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = useCallback(() => {
        setIsDarkMode((prevMode) => !prevMode);
    }, []);

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
