

import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { BackHandler, LayoutAnimation, Platform, UIManager } from 'react-native';
import View from 'react-native-view';

export const INPUT_METHOD = {
    NONE: 'NONE',
    KEYBOARD: 'KEYBOARD',
    CUSTOM: 'CUSTOM',
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default MessagingContainer = ({
    containerHeight, contentHeight, keyboardHeight, keyboardVisible,
    keyboardWillShow, keyboardWillHide, keyboardAnimationDuration,
    inputMethod, onChangeInputMethod, children, renderInputMethodEditor }) => {

    const _prevKeyBoardVisible = useMemo(keyboardVisible, [keyboardVisible])

    useEffect(() => {
        if (!_prevKeyBoardVisible && keyboardVisible) {
            onChangeInputMethod(INPUT_METHOD.KEYBOARD);
        } else if (_prevKeyBoardVisible && !keyboardVisible && inputMethod !== INPUT_METHOD.CUSTOM) {
            onChangeInputMethod(INPUT_METHOD.NONE);
        }

        const animation = LayoutAnimation.create(
            keyboardAnimationDuration,
            Platform.OS === 'android' ? LayoutAnimation.Types.easeInEaseOut : LayoutAnimation.Types.keyboard,
            LayoutAnimation.Properties.opacity,
        );

        LayoutAnimation.configureNext(animation);

        SubscriptionBackButton = BackHandler.addEventListener('hardwareBackPress', () => {
            if (inputMethod === INPUT_METHOD.CUSTOM) {
                onChangeInputMethod(INPUT_METHOD.NONE);
                return true;
            }

            return false;
        })

        return () => {
            SubscriptionBackButton.remove();
        }

    }, [keyboardVisible, keyboardWillHide, keyboardWillShow])

    const useContentHeight = keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;

    const containerStyle = {
        height: useContentHeight ? contentHeight : containerHeight,
    }

    const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

    const inputStyle = {
        height: showCustomInput ? keyboardHeight || 250 : 0,
    }

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