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
  mines: number[];
  userMove: number[];
}
export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      mines: [0, 0, 2, 0, 2, 2, 0, 0, 2],
      userMove: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }
  render() {
    return (
      <View style={styles.container}>
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
            borderRadius:10
          }}
          onPress={()=>this.reset()}>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  }
  renderItem(item: ListRenderItemInfo<number>) {
    let name: string = "";
    switch (item.item) {
      case 1:
        name = "flag";
        break;
      case 2:
        name = "bomb";
        break;
      case 3:
        name = "times";
        break;
    }
    return (
      <TouchableOpacity
        onPress={() => this.onSelect(item)}
        onLongPress={() => this.onMark(item)}>
        <View
          style={{
            height: 60,
            width: 60,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "red",
            borderRadius: 20
          }}>
          {name.length > 0 ? <FAIcon name={name} size={40} /> : null}
        </View>
      </TouchableOpacity>
    );
  }
  onSelect = (item: ListRenderItemInfo<number>) => {
    let userMove: number[] = [...this.state.userMove];
    if (this.state.mines[item.index] === 2) {
      userMove[item.index] = 2;
    } else {
      userMove[item.index] = 3;
    }



    if (this.state.mines[item.index] === 2) {
      Alert.alert("Lose", "you lose, try again!", [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]);
      userMove = this.visibleAll();
    }

    if (this.calculateWin(userMove) != 0) {
      userMove = this.visibleAll();

      Alert.alert("You win", "Gratulation!", [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]);
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
        return { index: index, value: item };
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
      if (item === 0) {
        return 3;
      }
      return 2;
    });
  }
  reset() {
    this.setState({ userMove: [...this.state.userMove].fill(0) });
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
