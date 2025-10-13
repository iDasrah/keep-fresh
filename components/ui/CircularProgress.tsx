import {View, Text} from 'react-native'
import React from 'react'
import {styles} from "@/assets/style/circular-progress.styles";
import Svg, {Circle} from 'react-native-svg';
import {getProgressColor} from "@/lib/utils";

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
}

const CircularProgress = ({progress, size = 100, strokeWidth = 10}: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const color = getProgressColor(progress);

    return (
        <View style={[styles.container, {width: size, height: size}]}>
            <Svg width={size} height={size} style={styles.svg}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#D9D9D9"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={[styles.progressText, {color: color}]}>{progress}</Text>
            </View>
        </View>
    )
}
export default CircularProgress