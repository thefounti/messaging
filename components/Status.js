import Constants from 'expo-constants';
import { StyleSheet, NetInfo, Platform, StatusBar, Text, View } from 'react-native';
import { useState } from 'react';


const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : 0);

const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight,
    },
});

export default Status = () => {

    const [state, setState] = useState({ info: null })
    const isConnected = state.info !== 'none';
    const backgroundColor = isConnected ? 'white' : 'red';

    const statusBar = (
        <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={false}
        />
    )

    if (Platform.OS === 'ios') {
        return (
            <View style={[styles.status, { backgroundColor }]}>{statusBar}</View>
        )
    }
    ///TEMPORAL
    return (null);
}