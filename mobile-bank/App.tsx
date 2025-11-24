import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/theme';
import { useAuthStore } from './src/store/useAuthStore';
import { setAuthToken } from './src/api/client';

const NavigationRoot = () => {
  const { navTheme } = useTheme();
  const { token } = useAuthStore();
  
  // Initialize auth token in axios when app loads
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);
  
  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationRoot />
          <Toast position="top" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
