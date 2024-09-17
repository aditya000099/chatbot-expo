import React, { useRef, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, SafeAreaView, FlatList, ListRenderItem, Text, TextInput, TouchableOpacity, View, Dimensions, Animated, Easing } from 'react-native';
import { useState } from 'react';
import tw from 'twrnc';
import Octicons from '@expo/vector-icons/Octicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Svg, Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function HomeScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState<string>('');

  // Animation refs for moving green ball
  const ballPositionX = useRef(new Animated.Value(0)).current;
  const ballPositionY = useRef(new Animated.Value(0)).current;

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput('');

      // Simulate AI bot response after 1 second
      setTimeout(() => {
        const botResponse: Message = { id: Date.now().toString(), text: 'Bot response goes here!', sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      }, 1000);
    }
  };

  const renderMessage: ListRenderItem<Message> = ({ item }) => (
    <View style={[tw`bg-transparent`]}>
      <View style={[tw`p-3 my-2 max-w-3/4`, item.sender === 'user' ? tw`bg-white self-end` : tw`bg-zinc-900 self-start`, item.sender === 'user' ? styles.userMessageBubble : styles.messageBubble]}>
        <Text style={item.sender === 'user' ? [tw`text-gray-900`, styles.title] : [tw`text-white`, styles.title]}>{item.text}</Text>
      </View>
      {/* Render buttons only for bot messages */}
      {item.sender === 'bot' && (
        <View style={tw`flex-row justify-between mt-1`}>
          <View style={tw`flex-row`}>
            <TouchableOpacity style={[tw`p-2 rounded-full mr-2 bg-zinc-800`, styles.button]}>
              <AntDesign name="like1" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[tw`p-2 rounded-full bg-zinc-800`, styles.button]}>
              <AntDesign name="dislike1" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[tw`p-2 ml-10 rounded-full bg-zinc-800`, styles.button]}>
              <EvilIcons name="redo" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  useEffect(() => {
    // Infinite animation loop for the green ball movement
    const animateBall = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(ballPositionX, {
            toValue: width - 100, // move to the right edge (minus some margin)
            duration: 500000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(ballPositionX, {
            toValue: 0,
            duration: 500000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(ballPositionY, {
            toValue: height - 100, // move to the bottom edge (minus some margin)
            duration: 70000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(ballPositionY, {
            toValue: 0,
            duration: 70000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateBall();
  }, [ballPositionX, ballPositionY]);

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`absolute inset-0 bg-black`}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: 300,
              height: 300,
            },
            {
              transform: [
                { translateX: ballPositionX },
                { translateY: ballPositionY },
              ],
            },
          ]}
        >
          <Svg width="300" height="300" viewBox="0 0 300 300">
            <Defs>
              <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor="rgba(0, 255, 108, 0.3)" />
                <Stop offset="90%" stopColor="rgba(0, 0, 0, 0)" />
                <Stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
              </RadialGradient>
            </Defs>
            <Circle cx="150" cy="150" r="150" fill="url(#grad)" />
          </Svg>
        </Animated.View>
      </View>

      <KeyboardAvoidingView behavior="padding" style={tw`flex-1 `}>

        <Text style={[tw`text-white text-lg text-center  flex justify-center items-center pt-20`, styles.title]}>
          Chat with Ai bot
        </Text>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tw`p-3 pb-5 pt-16`}
        />

        <View style={tw`rounded-full bg-zinc-900 p-3 mx-4 my-4`}>
          <View style={tw`flex-row items-center`}>
            <TextInput
              style={[tw`flex-1 text-white p-3 rounded-xl`, styles.title]}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor={'white'}
            />
            <TouchableOpacity onPress={sendMessage} style={tw`ml-3 bg-green-400 p-2 rounded-full`}>
              <Text style={[tw`text-black font-bold`, styles.title]}>
                <Octicons name="paper-airplane" size={28} color="black" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'SpaceMono',
  },
  messageBubble: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  userMessageBubble: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  greenBall: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(0, 236, 108, 0.8)',
    borderRadius: 50,
  },
  gradientGlow: {
    width: '100%',
    height: '100%',
    borderRadius: 150, // Make sure it's circular with soft edges
  },
});
