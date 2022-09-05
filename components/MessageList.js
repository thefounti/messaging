import React from 'react';
import PropTypes from 'prop-types';

import { MessageShape } from '../utils/MessageUtils';
import { FlatList, StyleSheet, Image, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';

export default MessageList = ({ messages, onPressMessage }) => {

    const renderMessageItem = ({ item }) => {

    }

    return (
        <FlatList
            style={styles.container}
            inverted
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={keyExtractor}
            keyBoardShouldPersistTaps={'handled'}
        />
    )

}

MessageList.propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
}

MessageList.defaulProps = {
    onPressMessage: () => { },
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'visible',//prevents clipping on resize
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 4,
        marginRight: 10,
        marginLeft: 60,
    },
    messageBubble: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: 'rgb(16,135,255)',
        borderRadius: 20,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    map: {
        width: 250,
        height: 250,
        borderRadius: 10,
    }
})