import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/styles/colors'
import { BaseLayout } from '../components/ui/BaseLayout';
import { buttonStyles } from '../src/styles/buttons';
import ProgressBar from '@/components/ui/ProgressBar';

export default function FrontCard() {
  return (
    <BaseLayout>
      <View style={styles.container}>
        <ProgressBar totalCards={0} remainingCards={0}/>
        <SafeAreaView style={styles.content}>
          <Text style={styles.word}>de hond</Text>
          <TextInput style={styles.input}></TextInput>
        <TouchableOpacity style={[buttonStyles.buttonPrimary]}>
        <Text style={[buttonStyles.textPrimary]}>Laat zien</Text>
        </TouchableOpacity>
        </SafeAreaView>
        <StatusBar style="light" />
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  linearGradient: {
    ...StyleSheet.absoluteFillObject, 
    flex: 1, 
  },
  content: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  word:{
    color: colors.white,
    fontSize: 48,
  },
  input: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'light',
    height: 56,
    margin: 12,
    padding: 10,
    borderRadius: 15,
    width: '100%',
    backgroundColor: colors.tertiary,
    marginTop: 34,
    marginBottom: 80,
  },
});
