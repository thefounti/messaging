import Constants  from 'expo-constants';
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

    const [state, setState] = useState({ info: 'none' })
    const isConnected = state.info !== 'none';
    const backgroundColor = isConnected ? 'white' : 'red';

    if (Platform.OS === 'ios') {
        return (
            <View style={[styles.status, { backgroundColor }]}></View>
        )
    }
    ///TEMPORAL
    return (<></>);
}