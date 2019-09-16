import React, { useEffect, useRef } from "react";
import { Animated } from "react-native"
import PropTypes from "prop-types";
import Svg, { G, Defs, ClipPath, Rect, Stop, LinearGradient, Line } from 'react-native-svg';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

function usePrevious(value) {
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes

    // Return previous value (happens before update in useEffect above)
    return ref.current;
}

const DashedGradientProgressBar = ({ percent, width, height, stopColors, unfilledColor, segmentWidth, gapWidth, duration }) => {
    const animatedRef = useRef(new Animated.Value(0))
    const previousPercent = usePrevious(percent);
    useEffect(() => {
        const animationHandler = Animated.timing(animatedRef.current, {
            toValue: percent,
            duration: duration,
            useNativeDriver: false
        }).start()
        return () => {
            animationHandler && animationHandler.stop();
            animatedRef.current.setValue(previousPercent)
        }
    }, [percent])


    const translateX = animatedRef.current.interpolate({
        inputRange: [0, 100],
        outputRange: ["0%", "100%"],
    })

    return (<AnimatedSvg height={`${height}`} width={`${width}`}>
        <LinearGradient
            id="grad"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
            width="100%"
            height="100%"
            gradientUnits="userSpaceOnUse">
            {stopColors}
        </LinearGradient>
        <Defs>
            <G x="0" y="0">
                <ClipPath id="clip">
                    <AnimatedRect
                        x={translateX}
                        y={"0"}
                        width="100%"
                        height="100%" />
                </ClipPath>
            </G>
        </Defs>
        <Line x1="0" y1="0" x2="100%" y2="0" stroke="url(#grad)" strokeWidth="100%" strokeDasharray={`${segmentWidth} ${gapWidth}`} />
        <Line x1="0" y1="0" x2="100%" y2="0" clipPath="url(#clip)" stroke={unfilledColor} strokeWidth="100%" strokeDasharray={`${segmentWidth} ${gapWidth}`} />
    </AnimatedSvg>)
}


DashedGradientProgressBar.defaultProps = {
    percent: 0,
    width: 375,
    height: 30,
    unfilledColor: "#7a7a7a",
    segmentWidth: 5,
    duration: 300,
    gapWidth: 5,
    stopColors: [
        <Stop key={1} offset="0%" stopColor="#ada7f3" />,
        <Stop key={4} offset="75%" stopColor="#ff55b8" />
    ]
}

DashedGradientProgressBar.propTypes = {
    percent: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    unfilledColor: PropTypes.string,
    stopColors: PropTypes.arrayOf(PropTypes.element),
    segmentWidth: PropTypes.number,
    gapWidth: PropTypes.number,
    duration: PropTypes.number
};

export default DashedGradientProgressBar