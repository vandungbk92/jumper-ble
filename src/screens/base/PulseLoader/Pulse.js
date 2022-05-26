import React, { Component } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export default class Pulse extends React.Component {
	constructor(props) {
		super(props);
	
		this.anim = new Animated.Value(0);
	}

	componentDidMount() {
		Animated.timing(this.anim, {
			toValue: 1,
			duration: this.props.interval,
			easing: Easing.in,
		})
		.start();
	}

	render() {
		const { size, pulseMaxSize, borderColor, backgroundColor, getStyle } = this.props;

		return (
			<View style={[styles.circleWrapper, {
				width: pulseMaxSize,
				height: pulseMaxSize,
				// marginLeft: -height/2,
				// marginTop: -pulseMaxSize,
			}]}>
				<Animated.View
					style={[styles.circle, {
						borderColor,
						backgroundColor,
						width: this.anim.interpolate({
							inputRange: [0, 1],
							outputRange: [size, pulseMaxSize]
						}),
						height: this.anim.interpolate({
							inputRange: [0, 1],
							outputRange: [size, pulseMaxSize]
						}),
						borderRadius: pulseMaxSize/2,
						opacity: this.anim.interpolate({
							inputRange: [0, 1],
							outputRange: [1, 0]
						})
					}, getStyle && getStyle(this.anim)]}
				/>
			</View>
		);
	}	
}


const styles = StyleSheet.create({
	circleWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		right: 0
	},
	circle: {
		borderWidth: 4 * StyleSheet.hairlineWidth,
	},
});