import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, Image } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Features from "../components/features"
const HomeScreen = () => {
  const [messages, setMessages]= useState([])

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        <View  className="flex-row justify-center">
          <Image style={{width: wp(25), height: hp(25)}}source={require('../../assets/images/aiChatbot.png')}/>
        </View>

        {/* features || messages */}
        {
          messages.length > 0 ? (
            <View>

            </View>
          ) : (
            <Features />
          )        
        }

      </SafeAreaView>
    </View>
  )
}

export default HomeScreen