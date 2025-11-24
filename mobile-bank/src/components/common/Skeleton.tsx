import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';

interface Props {
  style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<Props> = ({ style }) => {
  const { theme } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.colors.border,
          opacity: shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
          borderRadius: 16,
        },
        style,
      ]}
    />
  );
};

export default Skeleton;
