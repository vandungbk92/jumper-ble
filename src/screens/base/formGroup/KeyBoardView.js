import React from 'react';
import { ScrollView, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { styleContainer } from '../../../stylesContainer';
import { PLATFORM_IOS } from '../../../constants/variable';

export default class KeyboardView extends React.Component {
	UNSAFE_componentWillMount() {
		this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
		this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}

	componentWillUnmount() {
		this.keyboardDidShowSub.remove();
		this.keyboardDidHideSub.remove();
	}

	keyboardDidShow = () => {
	}

	keyboardDidHide = () => {
	}

	render() {
		let behaviorKey = {}
		if (PLATFORM_IOS) {
			behaviorKey.behavior = 'padding'
		}
		return (
			<KeyboardAvoidingView
				{...this.props}
				{...behaviorKey}
				pointerEvents='box-none'
				style={styleContainer.KeyboardAvoidingView}
			>
				<ScrollView>
					{this.props.children}
				</ScrollView>
			</KeyboardAvoidingView>
		);
	}
}
