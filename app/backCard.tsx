import { StyleSheet, View, Text, Image } from 'react-native';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/styles/colors';
import ProgressBar from '@/components/ui/ProgressBar';
import SoundIcon from '@/components/ui/SoundIcon'


export default function BackCard() {
  return (
    <BaseLayout>
      <View style={styles.container}>
        <ProgressBar totalCards={0} remainingCards={0} />
        <SafeAreaView style={styles.content}>
          <Image source={require('@/assets/images/dog-ai.png')} style={[{ width: 350, height: 350 }, styles.image]} />
          <View style={styles.soundIcon}>
            <SoundIcon  style={styles.soundIcon} />
          </View>
          <Text style={styles.word}>el Perro</Text>
          <Text style={styles.type}>Zelfstandig naamwoord</Text>
          <Text style={styles.exampleForeign}>El perro corre rápidamente en el parque.</Text>
          <Text style={styles.exampleNative}>De hond rent snel in het park</Text>
        </SafeAreaView>
      </View>
    </BaseLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    borderRadius: 15,
  },
  soundIcon:{
   backgroundColor: colors.tertiary,
   padding: 2,
  },
  word: {
    color: colors.white,
    fontSize: 48,
  },
  type: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 100,
    marginBottom: 32,
  },
  exampleForeign: {
    color: colors.white,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  exampleNative: {
    color: colors.white,
    fontWeight: 200,
    fontSize: 20,
    textAlign: 'center'
  }
});
