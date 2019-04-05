import React, { Component } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  ListRenderItemInfo,
  Text
} from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome5";
import { Point } from "../models";
import EStyleSheet from "react-native-extended-stylesheet";

interface Props {
  userMove: number[];
  mines: Point[];
  onSelect: any;
}
export default class Mines extends Component<Props> {
  render() {
    return (
      <View style={styles.conatiner}>
        <FlatList<number>
          data={this.props.userMove}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          numColumns={3}
          renderItem={item => this.renderItem(item)}
        />
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
        name = this.props.mines[item.index].value.toString();
        break;
    }
    return (
      <TouchableOpacity
        onPress={() => this.props.onSelect(item.index)}
        // onLongPress={() => this.onMark(item)}
      >
        <View style={styles.tile}>
          {name.length > 0 ? (
            item.item < 3 ? (
              <FAIcon name={name} size={40} />
            ) : (
              <Text style={styles.titleText}>{name}</Text>
            )
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = EStyleSheet.create({
  conatiner: { height: 180, width: 180 },
  titleText: { fontSize: "$iconSize" },
  tile: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "$iconColor",
    borderRadius: 20
  }
});
