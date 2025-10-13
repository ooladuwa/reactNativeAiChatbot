import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'


const WelcomeScreen = () => {
    const navigation = useNavigation()

  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
        <View className="space-y-2 mt-40">
            <Text style={{fontSize: wp(10)}} className="text-center font-bold text-gray-700">Jarvis</Text>
            <Text style={{fontSize: wp(4)}} className="text-center tracking-wider font-bold text-gray-600">Your personal assistant, powered by AI</Text>
        </View>
        <View  className="flex-1 items-center justify-center bg-white">
            <Image style={{width: wp(45), height: hp(45)}}source={require('../../assets/images/aiChatbot.png')}/>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Home")} className="bg-emerald-500 mx-5 p-4 mb-20 rounded-2xl">
            <Text style={{fontSize: wp(6)}}  className="text-center font-bold text-white text-2xl">Get Started</Text>
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default WelcomeScreen