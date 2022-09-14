
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';

MeasureLayout.propTypes = {
    children: PropTypes.func.isRequired,
}

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

    return (
        <>
            {!state.layout && <View onLayout={handleLayout} style={styles.container}></View>}
            {children(layout)}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
