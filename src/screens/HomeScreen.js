import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Voice from '@react-native-voice/voice';
import Features from '../components/Features';
import { apiCall } from '../api/openAi';
import LoadingSpinner from '../components/LoadingSpinner';
import Tts from 'react-native-tts';

const HomeScreen = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  // Methods
  const clear = () => {
    Tts.stop();
    setMessages([]);
    setSpeaking(false);
  };
  const stopSpeaking = () => {
    setSpeaking(false);
    Tts.stop();
  };
  const speechStartHandler = () => {
    console.log('speech start handler');
  };
  const speechEndHandler = () => {
    setRecording(false);
    console.log('speech end handler');
  };
  const speechResultsHandler = e => {
    const text = e.value[0];
    setResult(text);
    console.log('speech event', e);
  };
  const speechErrorHandler = e => {
    console.log('speech error', e);
  };

  const startRecording = async () => {
    setRecording(true);
    Tts.stop();
    setSpeaking(false);
    try {
      await Voice.start('en-US'); // if erroring, try en-GB
    } catch (error) {
      console.log('start recording error', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setRecording(false);
      // fetch response from chatGPT
      fetchResponse();
    } catch (error) {
      console.log('stop recording error', error);
    }
  };

  const fetchResponse = () => {
    if (result.trim().length > 0) {
      let newMessages = [...messages];
      newMessages.push({ role: 'user', content: result.trim() });
      setMessages([...newMessages]);
      updateScrollView();
      setLoading(true);
      apiCall(result.trim(), newMessages).then(res => {
        setLoading(false);
        if (res.success) {
          setMessages([...res.data]);
          updateScrollView();
          setResult('');
          startTextToSpeech(res.data[res.data.length - 1]);
        } else {
          Alert.alert('Error', res.msg);
        }
      });
    }
  };

  const startTextToSpeech = message => {
    if (!message.content.includes('https')) {
      setSpeaking(true);
      Tts.speak(message.content, {
        iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
        rate: 0.5,
      });
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 200);
  };

  useEffect(() => {
    console.log('Available TTS methods:', Object.keys(Tts));
    // voice handler events
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    Voice.onSpeechError = speechErrorHandler;

    // tts handler events
    Tts.addEventListener('tts-start', event => console.log('start', event));
    Tts.addEventListener('tts-progress', event =>
      console.log('progress', event),
    );
    Tts.addEventListener('tts-finish', event => console.log('finish', event));
    Tts.addEventListener('tts-cancel', event => console.log('cancel', event));

    return () => {
      // destroy the voice instance
      Voice.destroy().then(Voice.removeAllListeners());
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="mx-5 flex flex-1">
        {/* bot icon */}
        <View className="flex-row justify-center">
          <Image
            style={{ width: wp(27), height: hp(15) }}
            source={require('../../assets/images/aiChatbot2.png')}
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
                ref={scrollViewRef}
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
          {loading ? (
            <View className="flex-1, justify-center, items-center">
              {/* <LoadingSpinner size={200} /> */}
              <Image
                style={{ width: wp(40), height: wp(40) }}
                source={require('../../assets/images/spinner.gif')}
              />
              <Text className="text-white, mt-20">Processing...</Text>
            </View>
          ) : recording ? (
            <TouchableOpacity onPress={stopRecording}>
              {/* Stop Recording Button */}
              <Image
                className="rounded-full"
                style={{ width: wp(20), height: hp(10) }}
                source={require('../../assets/images/ai-stop-button.png')}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              {/* Start Recording Button */}
              <Image
                className="rounded-full"
                style={{ width: wp(20), height: hp(10) }}
                source={require('../../assets/images/ai-record-button.png')}
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
