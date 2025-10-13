import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Features from '../components/features';
import { dummyMessages } from '../constants';

const HomeScreen = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const clear = () => setMessages([]);
  const stopSpeaking = () => setSpeaking(false);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="mx-5 flex flex-1">
        {/* bot icon */}
        <View className="flex-row justify-center">
          <Image
            style={{ width: wp(25), height: hp(25) }}
            source={require('../../assets/images/aiChatbot.png')}
          />
        </View>

        {/* features || messages */}
        {messages.length > 0 ? (
          <View className="flex-1 space-y-2">
            <Text
              style={{ fontSize: wp(5) }}
              className="mb-2 font-semibold text-gray-700"
            >
              Assistant
            </Text>
            <View
              style={{ height: hp(50) }}
              className="rounded-3xl bg-neutral-200 p-4"
            >
              <ScrollView
                bounces={false}
                className="space-y-4"
                showsVerticalScrollIndicator={false}
              >
                {messages.map((message, index) => {
                  if (message.role === 'assistant') {
                    if (message.content.includes('https')) {
                      // it's an ai image
                      return (
                        <View key={index} className="flex-row justify-start">
                          <View className="flex rounded-2xl rounded-tl-none bg-emerald-100 p-2">
                            <Image
                              style={{ width: wp(60), height: hp(40) }}
                              className="rounded-2xl"
                              source={{ uri: message.content }}
                              resizeMode="cover"
                              onLoad={() =>
                                console.log('Image loaded:', message.content)
                              }
                              onError={e =>
                                console.log(
                                  'Image failed to load:',
                                  message.content,
                                  e.nativeEvent,
                                )
                              }
                            />
                          </View>
                        </View>
                      );
                    } else {
                      // text response
                      return (
                        <View
                          key={index}
                          style={{ width: wp(70) }}
                          className="m-2 rounded-xl rounded-tl-none bg-emerald-100 p-2"
                        >
                          <Text style={{ fontSize: wp(5) }}>
                            {message.content}
                          </Text>
                        </View>
                      );
                    }
                  } else {
                    // user input
                    return (
                      <View key={index} className="flex-row justify-end">
                        <View
                          style={{ width: wp(70) }}
                          className="m-2 rounded-xl rounded-tr-none bg-white p-2"
                        >
                          <Text style={{ fontSize: wp(5) }}>
                            {message.content}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                })}
              </ScrollView>
            </View>
          </View>
        ) : (
          <Features />
        )}
        {/* recording, clear and stop buttons*/}
        <View className="flex items-center justify-center">
          {recording ? (
            <TouchableOpacity>
              <Image
                className="rounded-full"
                style={{ width: wp(10), height: hp(10) }}
                source={require('../../assets/images/record-button.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Image
                className="rounded-full"
                style={{ width: wp(10), height: hp(10) }}
                source={require('../../assets/images/record-button.png')}
              />
            </TouchableOpacity>
          )}

          {messages.length > 0 && (
            <TouchableOpacity
              className="absolute right-10 rounded-3xl bg-neutral-400 p-2"
              onPress={clear}
            >
              <Text className="font-semibold text-white">Clear</Text>
            </TouchableOpacity>
          )}

          {speaking && (
            <TouchableOpacity
              className="absolute left-10 rounded-3xl bg-red-400 p-2"
              onPress={stopSpeaking}
            >
              <Text className="font-semibold text-white">Stop</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
