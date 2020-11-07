import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Components/Home';
import AnimalsMap from '../Components/AnimalsMap';

export default class Navigation extends React.Component {
  Stack = createStackNavigator();

  render() {
    return (
      <NavigationContainer>
        <this.Stack.Navigator>

          <this.Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: 'Home',
              headerStyle: {
                elevation: 0,
                backgroundColor: '#447604',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
                textAlign: 'center',
              },
            }}
          />

          <this.Stack.Screen
            name="AnimalsMap"
            component={AnimalsMap}
            options={{
              title: 'Animals Location',
              headerStyle: {
                backgroundColor: '#447604',
                elevation: 0,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />

        </this.Stack.Navigator>
      </NavigationContainer>
    );
  }
}
