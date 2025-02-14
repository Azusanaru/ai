export const platformShadow = (level: number) => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: level },
      shadowOpacity: 0.1 * level,
      shadowRadius: level * 2
    },
    android: {
      elevation: level
    }
  });
}; 