
import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Keyboard, Platform } from "react-native";

import { INPUT_METHOD } from "./MessagingContainer";

const INITIAL_ANIMATION_DURATION = 250;



export default KeyboardState = (props) => {
    const { layout, children, inputMethod } = props;
    const { height } = layout;

    const [state, setState] = useState({
        contentHeight: height,
        keyboardHeight: 0,
        keyboardVisible: inputMethod !== INPUT_METHOD.KEYBOARD ? false : true,
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
        console.log("keyBoardWillShow");
        // setState({ ...state, keyboardWillShow: true });
        measure(event, "WillShow");
    }

    const keyboardWillHide = (event) => {
        console.log("keyBoardWillHide");
        // setState({ ...state, keyboardWillHide: true });
        measure(event, "WillHide");
    }

    const keyboardDidShow = (event) => {
        console.log("keyBoardDidShow");
        // setState({ ...state, keyboardWillShow: false, keyboardVisible: true });
        measure(event, "DidShow");
    }

    const keyboardDidHide = (event) => {
        console.log("keyBoardDidHide");
        setState({ ...state, keyboardWillHide: false, keyboardVisible: false });
    }

    const measure = (event, strEve) => {
        const { endCoordinates: { height, screenY }, duration = INITIAL_ANIMATION_DURATION } = event;

        setState({
            ...state,
            contentHeight: screenY - layout.y,
            keyboardHeight: height,
            keyboardAnimationDuration: duration,
            keyboardWillHide: strEve === "WillHide" ? true : state.keyboardWillHide,
            keyboardWillShow: strEve === "DidShow" ? false : (strEve === "WillShow" ? true : state.keyboardWillShow),
            keyboardVisible: strEve === "DidShow" ? true : state.keyboardVisible,
        })
    }

    // return children({
    //     containerHeight: layout.height,
    //     contentHeight: state.contentHeight,
    //     keyboardHeight: state.keyboardHeight,
    //     keyboardVisible: state.keyboardVisible,
    //     keyboardWillShow: state.keyboardWillShow,
    //     keyboardWillHide: state.keyboardWillHide,
    //     keyboardAnimationDuration: state.keyboardAnimationDuration,
    // });

    return (
        <>
            {children({
                containerHeight: layout.height,
                contentHeight: state.contentHeight,
                keyboardHeight: state.keyboardHeight,
                keyboardVisible: state.keyboardVisible,
                keyboardWillShow: state.keyboardWillShow,
                keyboardWillHide: state.keyboardWillHide,
                keyboardAnimationDuration: state.keyboardAnimationDuration,
            })}
        </>
    )

}

KeyboardState.propTypes = {
    layout: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.func.isRequired,
    inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
}
