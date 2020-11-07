import React from 'react';
import {
  StyleSheet,
  Alert,
  Platform,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import MapView, {
  Marker,
  AnimatedRegion
} from 'react-native-maps';
import * as geolib from 'geolib';
import {
  getDistance,
  getPreciseDistance
} from 'geolib';

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const initialRegion = {
  latitude: -37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

export default class AnimalsMap extends React.Component {
  map = null;

  state = {
    region: {
      latitude: 46.987471,
      longitude: 3.150616,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    ready: false,
    currentPosition: []
  };

  setRegion(region) {
    if (this.state.ready) {
      setTimeout(() => {
        this.mapView && this.mapView.animateToRegion(this.state.region, 100);
      }, 10)
    }
    this.setState({ region });
  }

  componentDidMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition() {
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (geolib.isValidCoordinate(position.coords)) {
            const region = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            };

            this.setRegion(region);
            this.setState({
              currentPosition: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
            });
          }
        },
        (error) => {
          console.error(error);

          // TODO: improve conditions
          switch (error.code) {
            case 1:
              if (Platform.OS === 'ios') {
                Alert.alert('', 'Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización');
              } else {
                Alert.alert('', 'Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización');
              }
              break;
            default:
              Alert.alert('', 'Error al detectar tu locación');
          }
        }
      );
    } catch(e) {
      alert(e.message || '');
    }
  };

  onMapReady = (e) => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  render() {
    const { navigation } = this.props;
    const { region } = this.state;

    return (
      <React.Fragment>
        <View style={{flex: 5}}>
          <MapView
            showsPointsOfInterest={true}
            provider="google"
            initialRegion={this.state.region}
            showsUserLocation
            ref={ map => { this.map = map }}
            onMapReady={this.onMapReady}
            showsMyLocationButton={true}
            style={StyleSheet.absoluteFill}
            textStyle={{ color: '#bc8b00' }}
            containerStyle={{
              backgroundColor: '#6CC551',
              borderColor: '#BC8B00'
            }}>
          </MapView>
        </View>
        <View style={styles.TouchableOpacityContainer}>
          <TouchableOpacity
            activeOpacity = { .4 }
            style={styles.TouchableOpacityStyle}
            onPress={() => { navigation.navigate('Home'); }}
          >
            <Text style={styles.TextStyle}>Go back</Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  TouchableOpacityContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#fff'
  },
  TouchableOpacityStyle: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '90%',
    backgroundColor: '#6CC551'
  },
  TextStyle: {
    color:'#fff',
    textAlign:'center',
    textTransform: 'uppercase'
  }
});
