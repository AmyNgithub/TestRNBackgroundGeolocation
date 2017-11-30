/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      longitude: '',
      latitude: ''
    };
  }
  componentDidMount() {
    this.onLocation = this.onLocation.bind(this);
    BackgroundGeolocation.on('location', this.onLocation);

    // This handler fires whenever bgGeo receives an error
    BackgroundGeolocation.on('error', this.onError);

    // This handler fires when movement states changes (stationary->moving; moving->stationary)
    BackgroundGeolocation.on('motionchange', this.onMotionChange);

    // This event fires when a change in motion activity is detected
    BackgroundGeolocation.on('activitychange', this.onActivityChange.bind(this));

    // This event fires when the user toggles location-services
    BackgroundGeolocation.on('providerchange', this.onProviderChange);

    // 2.  #configure the plugin (just once for life-time of app)
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      distanceFilter: 10,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, //true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, //Only in development //BackgroundGeolocation.LOG_LEVEL_OFF,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
    }, (state) => {
      console.log('- BackgroundGeolocation config: ', state.enabled);

      if (!state.enabled) {
        // 3. Start tracking!
        BackgroundGeolocation.start(function () {
          console.log('- Start success');
        });
      }
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.un('location', this.onLocation);
    BackgroundGeolocation.un('error', this.onError);
    BackgroundGeolocation.un('motionchange', this.onMotionChange);
    BackgroundGeolocation.un('activitychange', this.onActivityChange);
    BackgroundGeolocation.un('providerchange', this.onProviderChange);
  }

  onStart() {
    BackgroundGeolocation.start();
  }

  onStop() {
    BackgroundGeolocation.stop();
  }

    onLocation(location) {
    console.log('- [js]location: ', JSON.stringify(location));
    this.setState({ longitude: location.coords.longitude, latitude: location.coords.latitude })
  }
  onError(error) {
    const type = error.type;
    const code = error.code;
    bugsnag.notify(error);
    alert(type + ' Error: ' + code);
  }
  onActivityChange(activityName) {
    console.log('- Current motion activity: ', activityName);  // eg: 'on_foot', 'still', 'in_vehicle'
    console.log(activityName.activity);
    this.setState({ activity: activityName.activity });
  }
  onProviderChange(provider) {
    console.log('- Location provider changed: ', provider.enabled);  
  }
  onMotionChange(location) {
    console.log('- [js]motionchanged: ', JSON.stringify(location));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          This is a bare minimum test app for RNBackgroundGeolocation. {'\n'} 
        </Text>
        <Text>
          latitude: {this.state.latitude} {'\n'}
          longitude: {this.state.longitude} {'\n'} 
        </Text>
        <Button onPress={this.onStart.bind(this)} title="Start" />
        <Button onPress={this.onStop.bind(this)} title="Stop" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
