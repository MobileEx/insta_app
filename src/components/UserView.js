/* eslint-disable */
import React, { useEffect, useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const UserView = (props) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.pause) {
      Animated.timing(opacity, {
        toValue: 0,
        timing: 300,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        timing: 300,
      }).start();
    }
  }, [props.pause]);

  return (
    <Animated.View style={[styles.userView, { opacity }]}>
      <Image source={{ uri: props.profile }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.time}>Posted 2h ago</Text>
      </View>
      <TouchableOpacity onPress={props.onClosePress}>
        <Icon name="close" color="white" size={25} style={{ marginRight: 8 }} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
  },
  userView: {
    flexDirection: "row",
    position: "absolute",
    top: 30,
    width: "98%",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 12,
    color: "white",
  },
  time: {
    fontSize: 12,
    fontWeight: "400",
    marginTop: 3,
    marginLeft: 12,
    color: "white",
  },
});

export default UserView;
