import { View, Text, StyleSheet } from "react-native";
import Status from "./components/Status";
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import { useState } from "react";

export default function App() {

  const [state, setState] = useState({
    messages: [
      createImageMessage('https://unsplash.it/300/300'),
      createTextMessage('World'),
      createTextMessage('Hello'),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324
      }),
    ],
  });

  const handlePressMessage = () => {

  }

  const renderMessageList = () => {

    const { messages } = state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
    )
  }

  const renderInputMethodEditor = () => {
    return (
      <View style={styles.inputMethodEditor}></View>
    )
  }

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}></View>
    )
  }
console.log('messages',state.messages);
  return (
    <View style={styles.container} >
      <Status />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputMethodEditor()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: 'white',
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.04)',
    backgroundColor: 'white'
  },
})
