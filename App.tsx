import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ListRenderItemInfo,
  Alert,
  Text
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import _ from "lodash";

interface Props {}
interface State {
  mines: Point[];
  userMove: number[];
}
class Point {
  public value: number = 0;
  public type: string = "";
  constructor(value: number, type: string) {
    this.value = value;
    this.type = type;
  }
}
export default class App extends Component<Props, State> {
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
        <Text style={{ fontSize: 40, paddingBottom: 50 }}>Mines</Text>
        <View style={{ height: 180, width: 180 }}>
          <FlatList<number>
            data={this.state.userMove}
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            numColumns={3}
            renderItem={item => this.renderItem(item)}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "red",
            paddingVertical: 10,
            paddingHorizontal: 20,
            margin: 10,
            borderRadius: 10
          }}
          onPress={() => this.newGame()}
        >
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderItem(item: ListRenderItemInfo<number>) {
    console.log(this.state.userMove);
    let name: string = "";
    switch (item.item) {
      case 1:
        name = "flag";
        break;
      case 2:
        name = "bomb";
        break;
      case 3:
        name = this.state.mines[item.index].value.toString();
        break;
    }
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(item)}
        // onLongPress={() => this.onMark(item)}
      >
        <View
          style={{
            height: 60,
            width: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "red",
            borderRadius: 20
          }}
        >
          {name.length > 0 ? (
            item.item < 3 ? (
              <FAIcon name={name} size={40} />
            ) : (
              <Text style={{ fontSize: 40 }}>{name}</Text>
            )
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
  onSelect = (item: ListRenderItemInfo<number>) => {
    let userMove: number[] = [...this.state.userMove];
    if (this.state.mines[item.index].type === "bomb") {
      userMove[item.index] = 2;
      Alert.alert("Lose", "you lose, try again!", [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]);
      userMove = this.visibleAll();
    } else {
      userMove[item.index] = 3;
      if (this.calculateWin(userMove) != 0) {
        userMove = this.visibleAll();

        Alert.alert("You win", "Gratulation!", [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ]);
      }
    }

    this.setState({ userMove });
  };
  onMark = (item: ListRenderItemInfo<number>) => {
    let userMove: number[] = [...this.state.userMove];
    if (userMove[item.index] === 0) {
      userMove[item.index] = 1;
    } else if (userMove[item.index] !== 2 && userMove[item.index] !== 3) {
      userMove[item.index] = 0;
    }
    this.setState({ userMove });
  };
  calculateLose(): boolean {
    return this.state.userMove.indexOf(3) !== -1;
  }
  calculateWin(userMove: number[]): number {
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
  visibleAll(): number[] {
    return [...this.state.mines].map(item => {
      if (item.type === "empty") {
        return 3;
      }
      return 2;
    });
  }
  reset() {
    this.setState({ userMove: [...this.state.userMove].fill(0) });
  }
  public generateDistanceBetweenBombs(tab: Point[]): any {
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
  public generateBoard(length: number): any {
    return new Array(9).fill(0).map(item => {
      if ((Math.random() * 10 + item).toFixed() % 2 === 0) {
        return { value: 0, type: "bomb" };
      }
      return { value: 0, type: "empty" };
    });
  }

  newGame() {
    this.reset();
    this.setState({
      mines: this.generateDistanceBetweenBombs(this.generateBoard(9))
    });
  }
}

const styles = StyleSheet.create({
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
