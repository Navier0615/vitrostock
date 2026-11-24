import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  label: string;
  position?: 'left' | 'right';
  color?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

export default function FAB({ label, position = 'right', color = '#007AFF', onPress, onLongPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.floatingButton,
        { backgroundColor: color },
        position === 'right' ? styles.positionRight : styles.positionLeft,
        pressed ? { opacity: 0.7 } : { opacity: 1 },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  positionRight: {
    right: 20,
  },
  positionLeft: {
    left: 20,
  },
  label: {
    color: 'white',
    fontSize: 20,
  },
});
