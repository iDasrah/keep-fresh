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

    const centerX = size / 2;
    const centerY = size / 2;

    return (
        <View style={[styles.container, {width: size, height: size}]}>
            <Svg width={size} height={size} style={styles.svg}>
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    stroke="#D9D9D9"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={centerX}
                    cy={centerY}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${centerX} ${centerY})`}
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={[styles.progressText, {color: color}]}>{progress}</Text>
            </View>
        </View>
    )
}
export default CircularProgress