import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default class TestPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { navigation } = this.props;

    return(
      <View style={styles.MainContainer}>

        <TouchableOpacity
          activeOpacity = { .4 }
          style={{
            paddingTop: 20,
            paddingBottom: 20,
            borderRadius: 5,
            marginBottom: 10,
            width: '80%',
            backgroundColor: '#6CC551',
          }}
          onPress={() => { navigation.navigate('Home'); }}
        >
          <Text style={styles.TextStyle}> Go back to home page </Text>
        </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  TouchableOpacityStyle: {
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: '50%',
    backgroundColor: '#00BCD4',
  },
  TextStyle: {
    color:'#fff',
    textAlign:'center',
    textTransform: 'uppercase'
  }
});
