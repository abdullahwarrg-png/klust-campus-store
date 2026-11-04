import { useState } from 'react';
import { Image, View, type ImageSourcePropType, type ViewStyle } from 'react-native';
import type { Category } from '../types/shop';
import { backdrop } from '../theme';

/**
 * Where the product sits inside its square catalog photo, as fractions of the photo.
 * The catalog photos share one framing per category, with generous studio margins,
 * so thumbnails crop to the product instead of shrinking it.
 */
const framing: Record<Category, { x: number; y: number; width: number; height: number }> = {
  tshirts: { x: 0.5, y: 0.526, width: 0.685, height: 0.698 },
  mugs: { x: 0.515, y: 0.503, width: 0.529, height: 0.547 },
};

export function ProductImage({
  source,
  category,
  colour,
  fill = 0.8,
  label,
  style,
}: {
  source: ImageSourcePropType;
  category: Category;
  colour: string;
  /** Share of the frame the product may occupy along its tighter axis. */
  fill?: number;
  label?: string;
  style?: ViewStyle;
}) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  const frame = framing[category];
  const scale = Math.min((box.width * fill) / frame.width, (box.height * fill) / frame.height);
  return (
    <View
      style={[{ backgroundColor: backdrop(colour), overflow: 'hidden' }, style]}
      onLayout={({ nativeEvent }) =>
        setBox({ width: nativeEvent.layout.width, height: nativeEvent.layout.height })
      }
    >
      {box.width > 0 && (
        <Image
          source={source}
          resizeMode="contain"
          accessibilityLabel={label}
          accessibilityIgnoresInvertColors
          style={{
            position: 'absolute',
            width: scale,
            height: scale,
            left: box.width / 2 - frame.x * scale,
            // Sit slightly low so overlaid badges never crowd a collar or rim.
            top: box.height * 0.53 - frame.y * scale,
          }}
        />
      )}
    </View>
  );
}
