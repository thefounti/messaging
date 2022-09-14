
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Keyboard, Platform } from "react-native";

KeyboardState.propTypes = {
    layout: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.func.isRequired,
}

const INITIAL_ANIMATION_DURATION = 250;

export default KeyboardState = (props) => {

    const { layout: { height }, children } = props;

    const [state, setState] = useState({
        contentHeight: height,
        keyboardHeight: 0,
        keyboardVisible: false,
        keyboardWillShow: false,
        keyboardWillHide: false,
        keyboardHeight: 0,
        keyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
    })

    useEffect(() => {
        // let unsuscribeKeyboardWillShow, unsuscribeKeyboardWillHide, unsuscribeKeyboardDidShow, unsuscribeKeyboardDidHide;
        const subscriptions = [];
        if (Platform.OS === 'ios') {
            subscriptions.push(Keyboard.addListener("keyboardWillShow", keyboardWillShow));
            subscriptions.push(Keyboard.addListener("keyboardWillHide", keyboardWillHide));
            subscriptions.push(Keyboard.addListener("keyboardDidShow", keyboardDidShow));
            subscriptions.push(Keyboard.addListener("keyboardDidHide", keyboardDidHide));
        } else {
            subscriptions.push(Keyboard.addListener("keyboardDidShow", keyboardDidShow));
            subscriptions.push(Keyboard.addListener("keyboardDidHide", keyboardDidHide));
        }

        return () => {
            subscriptions.forEach(subscription => subscription.remove());
        }
    }, [])

    const keyboardWillShow = (event) => {
        setState({ ...state, keyboardWillShow: true });
        measure(event);
    }

    const keyboardWillHide = (event) => {
        setState({ ...state, keyboardWillHide: true });
        measure(event);
    }

    const keyboardDidShow = (event) => {
        setState({ ...state, keyboardWillShow: false, keyboardVisible: true });
        measure(event);
    }

    const keyboardDidHide = (event) => {
        setState({ ...state, keyboardWillHide: false, keyboardVisible: false });
    }

    const measure = (event) => {
        const { endCoordinates: { height, screenY }, duration = INITIAL_ANIMATION_DURATION } = event;

        setState({
            ...state,
            contentHeight: screenY - layout.y,
            keyboardHeight: height,
            keyboardAnimationDuration: duration,
        })
    }

    return(
        <>
        {children({
            containerHeight:layout.height,
            contentHeight:state.contentHeight,
            keyboardHeight:state.keyboardHeight,
            keyboardVisible:state.keyboardVisible,
            keyboardWillShow:state.keyboardWillShow,
            keyboardWillHide:state.keyboardDidHide,
            keyboardAnimationDuration:state.keyboardAnimationDuration,
        })}
        </>
    )

}