import { View, Text, StyleSheet, Alert, Image, TouchableHighlight, BackHandler, } from "react-native";
import Status from "./components/Status";
import MessageList from "./components/MessageList";
import { createImageMessage, createLocationMessage, createTextMessage } from './utils/MessageUtils';
import { useEffect, useState } from "react";
import Toolbar from "./components/Toolbar";
// import Geolocation from "@react-native-community/geolocation";
import *  as Location from 'expo-location';

import ImageGrid from "./components/ImageGrid";

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
    fullscreenImageId: null,
    isInputFocused: false,
    loading: false
  });

  useEffect(() => {
    const unsuscribe = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = state;

      if (fullscreenImageId) {
        dismissFullscreenImage();
        return true;
      }
      return false
    });

    return () => {
      unsuscribe.remove();
    }

  }, [])

  const dismissFullscreenImage = () => {
    setState({ ...state, fullscreenImageId: null })
  }

  const handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete message?',
          'Are you sure want to permanently delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                const { messages } = state;
                setState({ ...state, messages: messages.filter(message => message.id !== id) })
              }
            },
          ])
        break;
      case 'image':
        setState({ ...state, fullscreenImageId: id })
        break;
      default:
        break;
    }
  }

  const renderMessageList = () => {

    const { messages } = state;

    return (
      <View style={styles.content}>
        <MessageList messages={messages} onPressMessage={handlePressMessage} />
      </View>
    )
  }

  const handlePressImage = (uri) => {
    setState({ ...state, messages: [createImageMessage(uri), ...state.messages] })
  }

  const renderInputMethodEditor = () => (
    <View style={styles.inputMethodEditor}>
      <ImageGrid onPressImage={handlePressImage}/>
    </View>
  )

  const handlePressToolbarLocation = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // setErrorMsg('Permission to access location was denied');
      console.log('Permission to access location was denied');
      return;
    }

    setState({
      ...state,
      loading: true
    })
    let location = await Location.getCurrentPositionAsync({});
    const { coords: { latitude, longitude } } = location;
    setState({
      ...state,
      messages: [
        createLocationMessage({
          latitude,
          longitude
        }),
        ...state.messages
      ],
      loading: false
    })
    console.log("location", location);
    // setLocation(location);

    // #region ESTO ES COMO SE ACERCARIA MÁS A LO QUE VIENE SIENDO EL LIBRO, AL FINAL USO EXPO-LOCATION
    // Geolocation.setRNConfiguration({
    //   skipPermissionRequests:true,
    //   authorizationLevel:'whenInUse'
    // })
    // Geolocation.getCurrentPosition(
    //   (position) => {
    //   const {coords: {latitude,longitude}}=position;

    //   setState({
    //     ...state,
    //     messages:[
    //       createLocationMessage({
    //         latitude,
    //         longitude
    //       }),
    //       ...state.messages
    //     ]
    //   })
    // },
    // (err) => {
    //   console.log("Error geoloc",err);
    // })
    // #endregion
  }

  const hanldePressToolbarCamera = () => {

  }

  const handleChangeFocus = (isFocused) => {
    setState({ ...state, isInputFocused: isFocused })
  }

  const handleSubmit = (text) => {
    setState({ ...state, messages: [createTextMessage(text), ...state.messages] })
  }

  const renderToolbar = () => {
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={state.isInputFocused}
          onSubmit={handleSubmit}
          onChangeFocus={handleChangeFocus}
          onPressCamera={hanldePressToolbarCamera}
          onPressLocation={handlePressToolbarLocation}
        />
      </View>
    )
  }

  const renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = state;

    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id == fullscreenImageId)

    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    )
  }

  return (
    <View style={styles.container} >
      <Status loading={state.loading} />
      {renderMessageList()}
      {renderToolbar()}
      {renderInputMethodEditor()}
      {renderFullscreenImage()}
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
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 2,
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: 'contain'
  }
})
