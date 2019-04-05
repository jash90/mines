import React, { Component } from "react";
import { Router, Stack, Scene } from "react-native-router-flux";
import EStyleSheet from 'react-native-extended-stylesheet';
import Home from "./src/screens/Home"
export default class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene key="home" component={Home} title="Home" />
        </Stack>
      </Router>
    );
  }
}


EStyleSheet.build({
  $iconSize:40,
  $iconColor:"red"
});