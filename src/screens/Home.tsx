import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Alert,
  Text
} from "react-native";
import _ from "lodash";
import { Point } from "../models";
import Mines from "../components/Mines";
import EStyleSheet from "react-native-extended-stylesheet"

interface Props {}
interface State {
  mines: Point[];
  userMove: number[];
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      mines: [],
      userMove: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }

  componentDidMount() {
    this.newGame();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Mines</Text>
        <Mines
          mines={this.state.mines}
          userMove={this.state.userMove}
          onSelect={(index: number) => this.onSelect(index)}
        />
        <TouchableOpacity style={styles.button} onPress={() => this.newGame()}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }

  public onSelect = (index: number) => {
    let userMove: number[] = [...this.state.userMove];
    if (this.state.mines[index].type === "bomb") {
      userMove[index] = 2;
      Alert.alert("Lose", "you lose, try again!", [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]);
      userMove = this.visibleAll();
    } else {
      userMove[index] = 3;
      if (this.calculateWin(userMove) != 0) {
        userMove = this.visibleAll();

        Alert.alert("You win", "Gratulation!", [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]);
      }
    }

    this.setState({ userMove });
  };
  public onMark = (index: number) => {
    let userMove: number[] = [...this.state.userMove];
    if (userMove[index] === 0) {
      userMove[index] = 1;
    } else if (userMove[index] !== 2 && userMove[index] !== 3) {
      userMove[index] = 0;
    }
    this.setState({ userMove });
  };
  public calculateLose(): boolean {
    return this.state.userMove.indexOf(3) !== -1;
  }
  public calculateWin(userMove: number[]): number {
    return this.state.mines
      .map((item, index) => {
        return { index: index, value: item.type === "empty" ? 0 : 2 };
      })
      .filter(item => {
        return item.value === 0;
      })
      .map((item: any) => {
        return userMove[item.index];
      })
      .reduce((prev: number, current: number) => {
        return prev * current;
      });
  }
  public visibleAll(): number[] {
    return [...this.state.mines].map(item => {
      if (item.type === "empty") {
        return 3;
      }
      return 2;
    });
  }
  public generateDistanceBetweenBombs(tab: Point[]): Point[] {
    tab.map(item => {
      if (item.type === "bomb") {
        return { value: 0, type: "bomb" };
      }
      return { value: 0, type: "empty" };
    });
    for (let x = 0; x < tab.length; x++) {
      if (tab[x].type === "bomb") {
        const position: number = x % 3;
        [-4, -3, -2, -1, 1, 2, 3, 4].forEach(element => {
          if (
            x + element > -1 &&
            x + element < tab.length &&
            tab[x + element].type === "empty" &&
            Math.abs(position - ((x + element) % 3)) <= 1
          ) {
            tab[x + element].value += 1;
          }
        });
      }
    }
    return tab;
  }
  public generateBoard(length: number): Point[] {
    return new Array(9).fill(0).map(item => {
      if ((Math.random() * 10 + item).toFixed() % 2 === 0) {
        return { value: 0, type: "bomb" };
      }
      return { value: 0, type: "empty" };
    });
  }
  public newGame() {
    this.setState({
      userMove: [...this.state.userMove].fill(0),
      mines: this.generateDistanceBetweenBombs(this.generateBoard(9))
    });
  }
}

const styles = EStyleSheet.create({
  button: {
    backgroundColor: '$iconColor',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 10
  },
  title: { fontSize: '$iconSize', paddingBottom: 50 },
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#F5FCFF",
    paddingTop: 30
  }
});
