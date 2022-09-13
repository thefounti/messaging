import { StyleSheet, CameraRollStatic, TouchableOpacity, Image } from "react-native";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { getPermissionsAsync, requestPermissionsAsync, getAssetsAsync } from 'expo-media-library';
import Grid from "./Grid";

const keyExtractor = ({ uri }) => uri;

export default ImageGrid = ({ }) => {
    // console.log("MEDIA_LIBRARY",MEDIA_LIBRARY);
    const [state, setState] = useState({
        images: [],
        loading: false,
        cursor: null,
    });
    // console.log("state",state);
    useEffect(() => {
        getImages();
    }, [])

    const getImages = async (after) => {
        // const { status } = await askAsync(MEDIA_LIBRARY)
        const { status } = await requestPermissionsAsync()
            .then(result => {
                return result;
            })
            .catch(err => console.log("Error Permisions", err));
        if (status !== 'granted') {
            console.log("Camera roll permision denied!!!")
        }
        
        if (state.loading) return;
        // loading = true;
        setState({ ...state, loading: true })
        const results = await getAssetsAsync({
            first: 20,
            after
        }).then(imgs => {
            return imgs
        }).catch(err => console.log("Error getAssestsAsync", err));

        const { assets, hasNextPage, endCursor } = results;
        const loadedImages = assets.map(item => { return { uri: item.uri } })
        // loading = false;
        // cursor = hasNextPage ? endCursor : null;
        setState({
            ...state,
            images: [...state.images.concat(loadedImages)],
            loading: false,
            cursor: hasNextPage ? endCursor : null,
        })

    }

    const getNextImages = () => {
        if (!state.cursor) return;

        getImages(state.cursor);
    }

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
            onEndReached={getNextImages}
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