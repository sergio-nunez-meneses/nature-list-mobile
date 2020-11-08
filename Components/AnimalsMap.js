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
import { fetchAnimals } from '../API/fetch';

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
      latitude: 46.2276,
      longitude: 2.2137,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    ready: false,
    currentPosition: [],
    latitude: 46.987471,
    longitude: 3.150616,
    data: [],
    selectedAnimal: ''
  };

  getAnimals = async() => {
    const animals = await fetchAnimals('amphibians', 1);
    this.setState({ data: animals });
  }

  componentDidMount() {
    this.getAnimals();
    this.getCurrentPosition();
    this.trackPosition();
  };

  componentDidUpdate() {
    navigator.geolocation.clearWatch(this.watchId);
    this.trackPosition();
  };

  onMapReady = (e) => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  setRegion(region) {
    if (this.state.ready) {
      setTimeout(() => {
        this.mapView && this.mapView.animateToRegion(this.state.region, 100);
      }, 10)
    }
    this.setState({ region });
  };

  animalsMarkers() {
    return this.state.data.map(
      (data) =>
      <Marker
        key={data.latitude}
        coordinate={{
          latitude: data.latitude,
          longitude: data.longitude
        }}
        title={data.name}
        description={`${data.latin_name}, ${data.specie}`}
        // image={require('../assets/name.extension')}
        onPress= {() => {
          this.calculateDistance(data.id, data.latitude, data.longitude);
        }}
      >
      </Marker>
    )
  };

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

  trackPosition() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (geolib.isValidCoordinate(position.coords)) {
          const { latitude, longitude } = position.coords;
          var distance = geolib.getDistance(position.coords, {
              latitude: 46.987721,
              longitude: 3.161632,
          });
          this.setState({ latitude, longitude });
        }
      },
      (error) => console.log(error),
      { enableHighAccuracy: false, timeout: 0, maximumAge: 0, distanceFilter: 0 }
    );
  };

  calculateDistance = async(id, latitude, longitude) => {
    try {
      let dis = geolib.getDistance(this.state.currentPosition,
        {
          latitude: latitude,
          longitude: longitude,
        }
      );
      Alert.alert('', `Vous êtes actuellement à ${dis} mettres (${Math.floor(dis / 1000)} KM)`);
      // console.log(`Vous êtes actuellement à ${dis} mettres (${dis / 1000} KM)`);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { navigation, children, renderMarker, markers } = this.props;
    const { region, latitude, longitude } = this.state;

    return (
      <React.Fragment>
        <View style={{flex: 5}}>
          <MapView
            provider="google"
            ref={ map => { this.map = map }}
            onMapReady={this.onMapReady}
            initialRegion={this.state.region}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsPointsOfInterest={true}
            style={StyleSheet.absoluteFill}
            textStyle={{ color: '#bc8b00' }}
            containerStyle={{
              backgroundColor: '#6CC551',
              borderColor: '#BC8B00'
            }}>
            {this.animalsMarkers()}
            {children && children || null}
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
