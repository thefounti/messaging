

import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { BackHandler, LayoutAnimation, Platform, UIManager, View } from 'react-native';
import { isIPhoneNotchFamily } from '@freakycoder/react-native-helpers';


export const INPUT_METHOD = {
    NONE: 'NONE',
    KEYBOARD: 'KEYBOARD',
    CUSTOM: 'CUSTOM',
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    console.log("UIManager.setLayoutAnimationEnabledExperimental", UIManager.setLayoutAnimationEnabledExperimental);
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const usePreviousValue = value => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

export default MessagingContainer = ({
    containerHeight, contentHeight, keyboardHeight, keyboardVisible,
    keyboardWillShow, keyboardWillHide, keyboardAnimationDuration,
    inputMethod, onChangeInputMethod, children, renderInputMethodEditor }) => {

    const _prevKeyBoardVisible = usePreviousValue(keyboardVisible);

    useEffect(() => {
        if (!_prevKeyBoardVisible && keyboardVisible) {
            onChangeInputMethod(INPUT_METHOD.KEYBOARD);
        } else if (_prevKeyBoardVisible &&  !keyboardVisible && inputMethod !== INPUT_METHOD.CUSTOM) {
            onChangeInputMethod(INPUT_METHOD.NONE);
        }

        if (Platform.OS === 'android') {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        } else {
            const animation = LayoutAnimation.create(
                keyboardAnimationDuration,
                LayoutAnimation.Types.keyboard,
                // Platform.OS === 'android' ? LayoutAnimation.Types.easeInEaseOut : LayoutAnimation.Types.keyboard,
                LayoutAnimation.Properties.opacity,
            );
            LayoutAnimation.configureNext(animation);

        }

        const SubscriptionBackButton = BackHandler.addEventListener('hardwareBackPress', () => {
            if (inputMethod === INPUT_METHOD.CUSTOM) {
                onChangeInputMethod(INPUT_METHOD.NONE);
                return true;
            }

            return false;
        })

        return () => {
            SubscriptionBackButton.remove();
        }

    }, [keyboardWillHide, keyboardVisible])

    const useContentHeight = keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;
    // console.log("keyboardWillShow", keyboardWillShow);
    // console.log("keyboardWillHide", keyboardWillHide);
    // console.log("_prevKeyBoardVisible", _prevKeyBoardVisible);
    // console.log("keyboardVisible", keyboardVisible);
    // console.log("inputMethod", inputMethod);
    // console.log("************************");
    console.log("************************");
    console.log("useContentHeight",useContentHeight);
    console.log("contentHeight",contentHeight);
    console.log("containerHeight",containerHeight);
    const containerStyle = {
        height: useContentHeight ? contentHeight : containerHeight,
    }
    console.log("containerStyle",containerStyle);
    
    
    const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;
    
    const keyboardIsHidden = inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;
    const keyboardIsHidding = inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;
    
    const inputStyle = {
        height: showCustomInput ? keyboardHeight || 336 : 0,
        marginTop: isIPhoneNotchFamily() && (keyboardIsHidden || keyboardIsHidding) ? 24 : 0
    }
    
    
    console.log("keyboardHeight",keyboardHeight);
    console.log("inputStyle",inputStyle);
    console.log("************************");
    return (
        <View style={containerStyle}>
            {children}
            <View style={inputStyle}>{renderInputMethodEditor()}</View>
        </View>
    )

}

MessagingContainer.propTypes = {
    ///KEYBOARD STATE
    containerHeight: PropTypes.number.isRequired,
    contentHeight: PropTypes.number.isRequired,
    keyboardHeight: PropTypes.number.isRequired,
    keyboardVisible: PropTypes.bool.isRequired,
    keyboardWillShow: PropTypes.bool.isRequired,
    keyboardWillHide: PropTypes.bool.isRequired,
    keyboardAnimationDuration: PropTypes.number.isRequired,

    //MAMAGING IME TYPE
    inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
    onChangeInputMethod: PropTypes.func,

    ///RENDERING CONTENT
    children: PropTypes.node,
    renderInputMethodEditor: PropTypes.func.isRequired,
}

MessagingContainer.defaultProps = {
    children: null,
    onChangeInputMethod: () => { },
}