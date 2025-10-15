import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Group, RoundedRect, vec } from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const LoadingSpinner = ({ size = 100 }) => {
  const rotation = useSharedValue(0);

  const center = size / 2;
  const spokeCount = 12;
  const spokeWidth = size * 0.08;
  const spokeHeight = size * 0.25;
  const innerRadius = size * 0.15;

  useEffect(() => {
    // Continuous rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1, // infinite repeat
      false, // don't reverse
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate spokes with fading opacity
  const spokes = Array.from({ length: spokeCount }, (_, i) => {
    const angle = (i / spokeCount) * 360;
    // Create gradient effect - darker spokes at the "front"
    const opacity = 0.2 + (i / spokeCount) * 0.8;
    const gray = Math.round(50 + (i / spokeCount) * 100);

    return {
      angle,
      color: `rgba(${gray}, ${gray}, ${gray}, ${opacity})`,
    };
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={{ width: size, height: size }}>
        <Group transform={[{ rotate: rotation }]} origin={vec(center, center)}>
          {spokes.map((spoke, i) => {
            const spokeAngle = spoke.angle;

            return (
              <Group
                key={i}
                transform={[{ rotate: spokeAngle }]}
                origin={vec(center, center)}
              >
                <RoundedRect
                  x={center - spokeWidth / 2}
                  y={innerRadius}
                  width={spokeWidth}
                  height={spokeHeight}
                  r={spokeWidth / 2}
                  color={spoke.color}
                />
              </Group>
            );
          })}
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingSpinner;
