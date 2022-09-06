import Constants from 'expo-constants';
import { StyleSheet, Platform, StatusBar, Text, View } from 'react-native';
import NetInfo, { } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';


const statusHeight = (Platform.OS === 'ios' ? Constants.statusBarHeight : 0);


export default Status = () => {

    ///VOY A SEGUIR EL EJEMPLO DEL LIBRO EN EL QUE USA EL GETNCONNECTIONINFO, DEPRECATED, QUE TE PASA EL TIPO CONEXION QUE TIENES. EN EL ACTUAL HAY UN TYPE QUE 
    ///CREO QUE CONTIENE LOS MISMOS VALORES QUE EL ANTIGUO Y UN "isConnected" TRUE/FALSE.
    const [state, setState] = useState({ info: 'none' })
    const isConnected = state.info !== 'none';
    const backgroundColor = isConnected ? 'white' : 'red';
    let subscription = null;
    // const handleChange = (info) => {
    //     state({ ...state, info })
    // }

    function handleChange(info) {
        //console.log("info omg", info);
        setState({ ...state, info: info.type })
    }

    ///Contienes el mount, unmount, change...
    useEffect(() => {
        const unsuscribe = NetInfo.addEventListener(handleChange)

        const fetchConnInfo = async () => {
            await NetInfo.fetch()
                .then((info) => {
                    setState({ ...state, info: info.type })
                })
                .catch((err) => { console.log('Error: ' + err); })
        }

        fetchConnInfo();
        ///Esto equivaldria al unmount

        ///PRUEBA DEL CAMBIO DE ESTADO DE RED
        // setTimeout(() => {
        //     handleChange({type:'none'});
        // }, 3000);
        return () => {
            ///VEIJAS VERSIONES
            // NetInfo.removeEventListener(handleChange);
            unsuscribe();
        }
    }, [])

    const statusBar = (
        <StatusBar
            backgroundColor={backgroundColor}
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={false}
        />
    )
    //console.log("isConnected",isConnected);
    const MessageContainer = () => (
        <View style={styles.messageContainer} pointerEvents={'none'}>
            {statusBar}
            {!isConnected && (
                <View style={styles.bubble}>
                    <Text style={styles.text}>No network connection</Text>
                </View>
            )}
        </View>
    )

    if (Platform.OS === 'ios') {
        return (
            <View style={[styles.status, { backgroundColor }]}>
                <MessageContainer />
            </View>
        )
    }

    return <MessageContainer />;
}


const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight,
    },
    messageContainer: {
        zIndex: 1,
        position: 'absolute',
        top: statusHeight + 20,
        right: 0,
        left: 0,
        height: 80,
        alignItems: 'center',
    },
    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red'
    },
    text: {
        color: 'white',
    },
});