import { StyleSheet, CameraRollStatic, TouchableOpacity,Image } from "react-native";
import PropTypes from "prop-types";
import React, { useState } from "react";
// import { Permissions } from 'expo';
import Grid from "./Grid";

const keyExtractor = ({ uri }) => uri;

export default ImageGrid = ({ }) => {
    const [state, setState] = useState({
        images: [
            { uri: 'https://picsum.photos/600/600?image=10' },
            { uri: 'https://picsum.photos/600/600?image=20' },
            { uri: 'https://picsum.photos/600/600?image=30' },
            { uri: 'https://picsum.photos/600/600?image=40' },
        ]
    });

    const renderItem = ({ item: { uri }, size, marginTop, marginLeft }) => {
        const style = {
            width: size,
            height: size,
            marginTop,
            marginLeft,
        }

        return (
            <Image source={{ uri }} style={style} />
        )
    }
    return (
        <Grid
            data={state.images}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
        />
    )

}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
})

ImageGrid.propTypes = {
    onPressImage: PropTypes.func,
}

ImageGrid.defaultProps = {
    onPressImage: () => { },
}