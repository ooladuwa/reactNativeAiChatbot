import React from 'react'
import { View, Text, Image } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const features = () => {
  return (
    <View style={{height: hp(60)}} className="mb-4">
      <Text style={{fontSize: wp(6.5)}} className="font-semibold text-gray-700 mb-4">Features</Text>
      <View className="bg-emerald-200 p-4 rounded-xl mb-4">
        <View className="flex-row items-center">
            <Image style={{width: wp(8), height: hp(4)}} source={require("../../assets/images/chatgpt-icon.png")}/>
            <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700 pl-2">ChatGPT</Text>
        </View>
            <Text style={{fontSize: wp(3.8)}} className="font-medium text-gray-700 mt-2">ChatGPT can provide you with instant and knowledgeable responses and assist you with creative ideas on a wide range of topics.</Text>
      </View>
      <View className="bg-purple-200 p-4 rounded-xl mb-4">
        <View className="flex-row items-center">
            <Image style={{width: wp(8), height: hp(4)}} source={require("../../assets/images/chatgpt-icon.png")}/>
            <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700 pl-2">DALL-E</Text>
        </View>
            <Text style={{fontSize: wp(3.8)}} className="font-medium text-gray-700 mt-2">DALL-E can generate imaginative and diverse images from textual descriptions expanding the boundaries of visual creation.</Text>
      </View>
      <View className="bg-cyan-200 p-4 rounded-xl mb-4">
        <View className="flex-row items-center">
            <Image style={{width: wp(8), height: hp(4)}} source={require("../../assets/images/chatgpt-icon.png")}/>
            <Text style={{fontSize: wp(4.8)}} className="font-semibold text-gray-700 pl-2">Smart AI</Text>
        </View>
            <Text style={{fontSize: wp(3.8)}} className="font-medium text-gray-700 mt-2">A powerful voice assistant with the abilities of ChatGPT and DALL-E, providing you the best of both worlds.</Text>
      </View>
    </View>
  )
}

export default features