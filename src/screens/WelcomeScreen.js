import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faRobot } from '@fortawesome/free-solid-svg-icons'

const WelcomeScreen = () => {
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
        <View className="space-y-2 mt-40">
            <Text className="text-center text-4xl font-bold text-gray-700">Jarvis</Text>
            <Text className="text-center tracking-wider font-bold text-gray-600">Your personal assistant, powered by AI</Text>
        </View>
        <View className="flex-1 items-center justify-center bg-white">
            <FontAwesomeIcon icon={faRobot} size={200} color={"green"}/>
        </View>
        <TouchableOpacity className="bg-green-700 mx-5 p-4 mb-20 rounded-2xl">
            <Text className="text-center font-bold text-white text-2xl">Get Started</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default WelcomeScreen