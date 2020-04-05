import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Animated, ActivityIndicator, View, Text } from 'react-native';
import { Spinner } from 'native-base';

export default function AnimatedButton(props) {
  const [loadingValue, setLoadingValue] = useState({
    width: new Animated.Value(props.width),
    borderRadius: new Animated.Value(props.borderRadius),
    opacity: new Animated.Value(1)
  });

  useEffect(() => {
    const { showLoading, width, height, borderRadius } = props;

    if (showLoading) {
      _loadingAnimation(width, height, borderRadius, height / 2, 1, 0);
    } else {
      setTimeout(() => {
        _loadingAnimation(height, width, height / 2, borderRadius, 0, 1);
      }, 0);
    }
  }, [props.showLoading]);

  function _loadingAnimation(widthStart, widthEnd, borderRadiusStart, borderRadiusEnd, opacityStart, opacityEnd) {
    if (loadingValue.width._value !== widthEnd) {
      loadingValue.width.setValue(widthStart);
      loadingValue.opacity.setValue(opacityStart);
      loadingValue.borderRadius.setValue(borderRadiusStart);

      Animated.timing(loadingValue.width, {
        toValue: widthEnd,
        duration: 400
      }).start();

      Animated.timing(loadingValue.borderRadius, {
        toValue: borderRadiusEnd,
        duration: 400
      }).start();

      Animated.timing(loadingValue.opacity, {
        toValue: opacityEnd,
        duration: 300
      }).start();
    }
  }

  function _renderTitle() {
    return (
      <Animated.Text
        style={[
          styles.buttonText,
          {
            opacity: loadingValue.opacity,
            color: props.titleColor,
            fontFamily: props.titleFontFamily,
            fontSize: props.titleFontSize,
            textTransform: 'uppercase'
          },
          { ...props.customStyles }
        ]}
      >
        {props.title}
      </Animated.Text>
    );
  }

  function _renderIndicator() {
    return <Spinner color={props.activityIndicatorColor} size="small" />;
  }

  return (
    <View style={{ ...styles.container, ...props.containerStyle }}>
      <TouchableWithoutFeedback onPress={!props.showLoading ? props.onPress : null}>
        <Animated.View
          style={[
            styles.containerButton,
            {
              width: loadingValue.width,
              height: props.height,
              backgroundColor: props.backgroundColor,
              borderWidth: props.borderWidth,
              borderRadius: loadingValue.borderRadius
            }
          ]}
        >
          {props.showLoading ? _renderIndicator() : _renderTitle()}
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  )
}

AnimatedButton.defaultProps = {
  title: 'Button',
  titleColor: 'white',
  backgroundColor: 'gray',
  activityIndicatorColor: 'white',
  borderRadius: 0,
  customStyles: {},
  containerStyle: {}
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  containerButton: {
    justifyContent: 'center'
  },
  buttonText: {
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});