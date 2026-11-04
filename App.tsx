import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { ShopProvider } from './src/state/ShopProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colours } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular: require('@expo-google-fonts/dm-sans/400Regular/DMSans_400Regular.ttf'),
    DMSans_500Medium: require('@expo-google-fonts/dm-sans/500Medium/DMSans_500Medium.ttf'),
    DMSans_600SemiBold: require('@expo-google-fonts/dm-sans/600SemiBold/DMSans_600SemiBold.ttf'),
    DMSans_700Bold: require('@expo-google-fonts/dm-sans/700Bold/DMSans_700Bold.ttf'),
  });
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={s.canvas}>
        <View style={s.app}>
          {!fontsLoaded && !fontError ? (
            <View style={s.loading}>
              <ActivityIndicator color={colours.blue} />
            </View>
          ) : (
            <ShopProvider>
              <AppNavigator />
            </ShopProvider>
          )}
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  canvas: { flex: 1, backgroundColor: '#EAF0F8' },
  app: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: colours.white,
    ...(Platform.OS === 'web' ? { maxWidth: 480, boxShadow: '0 0 60px #10295215' } : {}),
  },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
