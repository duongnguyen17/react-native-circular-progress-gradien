import React from "react";
import PropTypes from "prop-types";
import { Animated, Easing } from "react-native";
import CircularProgress from "./CircularProgress";
const AnimatedProgress = Animated.createAnimatedComponent(CircularProgress);

export default class AnimatedCircularProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fillAnimation: new Animated.Value(props.prefill),
    };
    if (props.onFillChange) {
      this.state.fillAnimation.addListener(({ value }) =>
        props.onFillChange(value)
      );
    }
  }

  componentDidMount() {
    this.animate(this.props.fill);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fill !== this.props.fill) {
      this.animate(this.props.fill);
    }
  }

  // reAnimate(prefill, toVal, dur, ease) {
  //   this.setState(
  //     {
  //       fillAnimation: new Animated.Value(prefill),
  //     },
  //     () => this.animate(toVal, dur, ease)
  //   );
  // }

  animate(toVal, dur, ease) {
    const toValue = toVal >= 0 ? toVal : this.props.fill;
    const duration = dur || this.props.duration;
    const easing = ease || this.props.easing;
    const useNativeDriver = this.props.useNativeDriver;
    const delay = this.props.delay;

    const anim = Animated.timing(this.state.fillAnimation, {
      useNativeDriver,
      toValue,
      easing,
      duration,
      delay,
    });
    anim.start(this.props.onAnimationComplete);

    return anim;
  }

  animateColor() {
    if (this.props.tintColor.length === 1) {
      return this.props.tintColor[0];
    }

    const tintAnimation = this.state.fillAnimation.interpolate({
      inputRange: this.props.inputRange,
      outputRange: this.props.tintColor,
    });

    return tintAnimation;
  }

  render() {
    const { fill, prefill, inputRange, ...other } = this.props;

    return (
      <AnimatedProgress
        {...other}
        fill={this.state.fillAnimation}
        tintColor={this.animateColor()}
      />
    );
  }
}

AnimatedCircularProgress.propTypes = {
  ...CircularProgress.propTypes,
  prefill: PropTypes.number,
  duration: PropTypes.number,
  easing: PropTypes.func,
  onAnimationComplete: PropTypes.func,
  useNativeDriver: PropTypes.bool,
  delay: PropTypes.number,
  inputRange: PropTypes.arrayOf(PropTypes.number),
};

AnimatedCircularProgress.defaultProps = {
  duration: 500,
  easing: Easing.out(Easing.ease),
  prefill: 0,
  useNativeDriver: false,
  delay: 0,
};
