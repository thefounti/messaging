
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

export default MeasureLayout = ({ children }) => {
    const [state, setState] = useState({
        layout: null,
    })
    const handleLayout = (event) => {
        const { nativeEvent: { layout } } = event;

        setState({
            ...state,
            layout: {
                ...layout,
                y: layout.y + (Platform.OS === 'android' ? Constants.statusBarHeight : 0)
            },
        });
    };

    if (!state.layout)
        return (<View onLayout={handleLayout} style={styles.container}></View>);

    return children(state.layout);

    // return (
    //     <View>
    //         {!state.layout && <View onLayout={handleLayout} style={styles.container}></View>}
    //         {children(layout)}
    //     </View>
    // )
}

MeasureLayout.propTypes = {
    children: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
