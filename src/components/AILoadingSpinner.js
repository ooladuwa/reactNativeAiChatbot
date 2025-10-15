import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Path,
  LinearGradient,
  vec,
  Skia,
  RoundedRect,
  Shadow,
} from '@shopify/react-native-skia';
import {
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const AILoadingSpinner = ({ size = 400 }) => {
  const rotation = useSharedValue(0);
  const pulsePhase = useSharedValue(0);

  const center = size / 2;
  const radius = size / 2;

  useEffect(() => {
    // Continuous rotation animation
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1, // infinite repeat
      false, // don't reverse
    );

    // Continuous pulse animation
    pulsePhase.value = withRepeat(
      withTiming(Math.PI * 2, {
        duration: 2500,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // infinite repeat
      false, // don't reverse
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create arc paths with error handling
  const createArcPath = (centerX, centerY, arcRadius, startAngle, endAngle) => {
    try {
      const path = Skia.Path.Make();
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const startX = centerX + arcRadius * Math.cos(startRad);
      const startY = centerY + arcRadius * Math.sin(startRad);

      path.moveTo(startX, startY);
      path.arcToRotated(
        arcRadius,
        arcRadius,
        0,
        false,
        true,
        centerX + arcRadius * Math.cos(endRad),
        centerY + arcRadius * Math.sin(endRad),
      );

      return path;
    } catch (error) {
      console.warn('Error creating arc path:', error);
      return Skia.Path.Make();
    }
  };

  // Generate particle positions
  const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2;
    const particleRadius = 80 + (i % 3) * 30;
    return {
      baseAngle: angle,
      radius: particleRadius,
      size: 3 + (i % 2) * 2,
    };
  });

  // Create clipping mask with error handling
  const createClippingMask = () => {
    try {
      return Skia.Path.Make().addCircle(center, center, radius);
    } catch (error) {
      console.warn('Error creating clipping mask:', error);
      return Skia.Path.Make();
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Canvas style={{ width: size, height: size }}>
        {/* Circular clipping mask */}
        <Group clip={{ path: createClippingMask() }}>
          {/* Background gradient */}
          <RoundedRect x={0} y={0} width={size} height={size} r={0}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(size, size)}
              colors={['#6366f1', '#8b5cf6']}
            />
          </RoundedRect>

          {/* Animated particles */}
          <Group
            transform={[{ rotate: rotation }]}
            origin={vec(center, center)}
          >
            {particles.map((particle, i) => {
              const x = center + Math.cos(particle.baseAngle) * particle.radius;
              const y = center + Math.sin(particle.baseAngle) * particle.radius;
              return (
                <RoundedRect
                  key={i}
                  x={x - particle.size / 2}
                  y={y - particle.size / 2}
                  width={particle.size}
                  height={particle.size}
                  r={0}
                  color="rgba(255, 255, 255, 0.15)"
                />
              );
            })}
          </Group>

          {/* Spinning neural network arcs */}
          <Group
            transform={[{ rotate: rotation }]}
            origin={vec(center, center)}
          >
            {/* Arc 1 */}
            <Path
              path={createArcPath(center, center, 120, 0, 126)}
              style="stroke"
              strokeWidth={8}
              color="rgba(255, 255, 255, 0.6)"
              strokeCap="round"
            />
            <Circle
              cx={center + 120 * Math.cos((126 * Math.PI) / 180)}
              cy={center + 120 * Math.sin((126 * Math.PI) / 180)}
              r={6}
              color="rgba(255, 255, 255, 0.8)"
            />

            {/* Arc 2 */}
            <Path
              path={createArcPath(center, center, 105, 120, 246)}
              style="stroke"
              strokeWidth={8}
              color="rgba(255, 255, 255, 0.45)"
              strokeCap="round"
            />
            <Circle
              cx={center + 105 * Math.cos((246 * Math.PI) / 180)}
              cy={center + 105 * Math.sin((246 * Math.PI) / 180)}
              r={6}
              color="rgba(255, 255, 255, 0.8)"
            />

            {/* Arc 3 */}
            <Path
              path={createArcPath(center, center, 90, 240, 366)}
              style="stroke"
              strokeWidth={8}
              color="rgba(255, 255, 255, 0.3)"
              strokeCap="round"
            />
            <Circle
              cx={center + 90 * Math.cos((366 * Math.PI) / 180)}
              cy={center + 90 * Math.sin((366 * Math.PI) / 180)}
              r={6}
              color="rgba(255, 255, 255, 0.8)"
            />
          </Group>

          {/* Pulsing center circle with glow */}
          <Group>
            {/* Outer glow */}
            <Circle
              cx={center}
              cy={center}
              r={45}
              color="rgba(255, 255, 255, 0.3)"
            >
              <Shadow
                dx={0}
                dy={0}
                blur={25}
                color="rgba(255, 255, 255, 0.6)"
              />
            </Circle>

            {/* Main center circle - animated pulse */}
            <Group
              transform={[{ scale: pulsePhase }]}
              origin={vec(center, center)}
            >
              <Circle cx={center} cy={center} r={30} color="#ffffff" />

              {/* Inner AI core */}
              <Circle cx={center} cy={center} r={12} color="#6366f1" />
            </Group>
          </Group>

          {/* Rotating orbital dots */}
          <Group
            transform={[{ rotate: rotation }]}
            origin={vec(center, center)}
          >
            {[0, 1, 2, 3].map(i => {
              const angle = (i / 4) * Math.PI * 2;
              const x = center + Math.cos(angle) * 60;
              const y = center + Math.sin(angle) * 60;
              return (
                <Circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={4}
                  color="rgba(255, 255, 255, 0.7)"
                />
              );
            })}
          </Group>
        </Group>
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
});

export default AILoadingSpinner;
