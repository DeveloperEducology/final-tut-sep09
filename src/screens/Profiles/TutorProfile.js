import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'

const TutorProfile = ({navigation}) => {
  return (
    <View>
      <Text>TutorProfile</Text>
      <Button onPress={() =>
        navigation.navigate("Stakess", {
          screen: "create-profile",
        })
      }>CreateProfile</Button>
    </View>
  )
}

export default TutorProfile

const styles = StyleSheet.create({})