import { View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export default function ThemedView({ style, ...props }: Props) {
  return <View style={style} {...props} />;
} 