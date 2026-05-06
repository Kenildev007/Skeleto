import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle } from 'react-native';

let Reanimated: typeof import('react-native-reanimated') | null = null;
try {
  Reanimated = require('react-native-reanimated');
} catch {
  Reanimated = null;
}

export interface ShimmerProps {
  width: number;
  height: number;
  borderRadius: number;
  baseColor: string;
  highlightColor: string;
  speed: number;
  animation: 'shimmer' | 'pulse' | 'wave' | 'none';
  delayMs?: number;
  style?: ViewStyle;
}

export function Shimmer(props: ShimmerProps) {
  if (props.animation === 'none') {
    return <StaticBone {...props} />;
  }
  if (props.animation === 'pulse') {
    return Reanimated ? <ReanimatedPulse {...props} /> : <AnimatedPulse {...props} />;
  }
  return Reanimated ? <ReanimatedShimmer {...props} /> : <AnimatedShimmer {...props} />;
}

function StaticBone({ width, height, borderRadius, baseColor, style }: ShimmerProps) {
  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: baseColor, overflow: 'hidden' },
        style,
      ]}
    />
  );
}

function ReanimatedShimmer({ width, height, borderRadius, baseColor, highlightColor, speed, delayMs = 0, style }: ShimmerProps) {
  const Rea = Reanimated!;
  const progress = Rea.useSharedValue(-1);

  useEffect(() => {
    progress.value = Rea.withDelay(
      delayMs,
      Rea.withRepeat(
        Rea.withTiming(1, { duration: speed * 1000, easing: Rea.Easing.inOut(Rea.Easing.ease) }),
        -1,
        false,
      ),
    );
  }, [delayMs, speed, Rea, progress]);

  const animatedStyle = Rea.useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * width }],
  }));

  return (
    <View style={[{ width, height, borderRadius, backgroundColor: baseColor, overflow: 'hidden' }, style]}>
      <Rea.default.View style={[StyleSheet.absoluteFillObject, animatedStyle]}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: highlightColor, opacity: 0.6 }]} />
      </Rea.default.View>
    </View>
  );
}

function ReanimatedPulse({ width, height, borderRadius, baseColor, highlightColor, speed, delayMs = 0, style }: ShimmerProps) {
  const Rea = Reanimated!;
  const progress = Rea.useSharedValue(0);

  useEffect(() => {
    progress.value = Rea.withDelay(
      delayMs,
      Rea.withRepeat(
        Rea.withTiming(1, { duration: speed * 1000, easing: Rea.Easing.inOut(Rea.Easing.ease) }),
        -1,
        true,
      ),
    );
  }, [delayMs, speed]);

  const animatedStyle = Rea.useAnimatedStyle(() => ({
    backgroundColor: Rea.interpolateColor(progress.value, [0, 1], [baseColor, highlightColor]),
  }));

  return <Rea.default.View style={[{ width, height, borderRadius }, animatedStyle, style]} />;
}

function AnimatedShimmer({ width, height, borderRadius, baseColor, highlightColor, speed, delayMs = 0, style }: ShimmerProps) {
  const progress = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(progress, {
          toValue: 1,
          duration: speed * 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delayMs, speed, progress]);

  const translateX = progress.interpolate({ inputRange: [-1, 1], outputRange: [-width, width] });

  return (
    <View style={[{ width, height, borderRadius, backgroundColor: baseColor, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }] }]}>
        <View style={[StyleSheet.absoluteFillObject, { backgroundColor: highlightColor, opacity: 0.6 }]} />
      </Animated.View>
    </View>
  );
}

function AnimatedPulse({ width, height, borderRadius, baseColor, speed, delayMs = 0, style }: ShimmerProps) {
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delayMs),
        Animated.timing(progress, { toValue: 0.55, duration: speed * 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(progress, { toValue: 1, duration: speed * 500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delayMs, speed, progress]);

  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: baseColor, opacity: progress }, style]} />;
}
