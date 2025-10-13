import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex flex-1 justify-around bg-white">
      <View className="mt-40 space-y-2">
        <Text
          style={{ fontSize: wp(10) }}
          className="text-center font-bold text-gray-700"
        >
          Jarvis
        </Text>
        <Text
          style={{ fontSize: wp(4) }}
          className="text-center font-bold tracking-wider text-gray-600"
        >
          Your personal assistant, powered by AI
        </Text>
      </View>
      <View className="flex-1 items-center justify-center bg-white">
        <Image
          style={{ width: wp(45), height: hp(45) }}
          source={require('../../assets/images/aiChatbot.png')}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        className="mx-5 mb-20 rounded-2xl bg-emerald-500 p-4"
      >
        <Text
          style={{ fontSize: wp(6) }}
          className="text-center text-2xl font-bold text-white"
        >
          Get Started
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
