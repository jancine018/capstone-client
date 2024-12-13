import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './pages/login'; // Adjust the path accordingly
import Dashboard from './pages/dashboard';
import Register from './pages/register'; // Adjust the path accordingly
import ProductDetails from './pages/ProductDetails';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CartPage from './pages/CartPage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="CartPage" component={CartPage} />
        <Stack.Screen name="PlaceOrder" component={PlaceOrderPage} />
        <Stack.Screen name="OrderConfirmationPage" component={OrderConfirmationPage} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
