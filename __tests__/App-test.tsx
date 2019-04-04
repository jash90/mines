import 'react-native';
import React from 'react';
import App from '../App';

import renderer from 'react-test-renderer';

it('callculate ', () => {
  const app = new App({});
  app.state = {
    mines: [{
      value: 0,
      type: "empty"
    },
      {
        value: 0,
        type: "empty"
      },
      {
        value: 0,
        type: "bomb"
      },
      {
        value: 0,
        type: "empty"
      },
      {
        value: 0,
        type: "bomb"
      },
      {
        value: 0,
        type: "bomb"
      },
      {
        value: 0,
        type: "empty"
      },
      {
        value: 0,
        type: "empty"
      },
      {
        value: 0,
        type: "empty"
      }], userMove:[]};
  const tab = app.generateDistanceBetweenBombs();

  const result = [
    {
      value: 1,
      type: "empty"
    }, {
      value: 3,
      type: "empty"
    }, {
      value: 0,
      type: "bomb"
    }, {
      value: 1,
      type: "empty"
    }, {
      value: 0,
      type: "bomb"
    }, {
      value: 0,
      type: "bomb"
    }, {
      value: 1,
      type: "empty"
    }, {
      value: 2,
      type: "empty"
    }, {
      value: 2,
      type: "empty"
    },
  ];
  console.log(tab);
  expect(tab[0]).toEqual(result[0]);
  expect(tab).toEqual(result);
});