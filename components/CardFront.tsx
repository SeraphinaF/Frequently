import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/styles/colors';

interface CardFrontProps {
  card: any;
  isFlipped: boolean;
  flipCard?: () => void;
}

export default function CardFront({
  card,
  isFlipped,
  flipCard,
}: CardFrontProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderHighlightedExample = () => {
    const word = card.dutch_word.trim();
    const example = card.dutch_example;
    const regex = new RegExp(`(${word})`, 'i');
    const parts = example.split(regex);

    return (
      <Text style={styles.dutchExample}>
        {parts.map((part: string, index: number) =>
          part.toLowerCase() === word.toLowerCase() ? (
            <Text key={index} style={styles.boldWord}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  return (
    <View
      style={[
        styles.card,
        {
          opacity: !isFlipped && imageLoaded ? 1 : 0,
        },
      ]}
    >
      <Image
        source={{ uri: card.image_url }}
        style={styles.image}
        onLoad={() => setImageLoaded(true)}
      />
      {imageLoaded && (
        <>
          <Text style={styles.dutchWord}>{card.dutch_word}</Text>
          {renderHighlightedExample()}
          <TouchableOpacity onPress={flipCard} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Antwoord</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  dutchWord: {
    fontSize: 64,
    fontWeight: '500',
    color: colors.tertiary,
    marginTop: 16,
  },
  dutchExample: {
    fontSize: 20,
    fontWeight: '200',
    color: colors.tertiary,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  boldWord: {
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.tertiary,
  },
  image: {
    marginTop: 48,
    width: '100%',
    height: '45%',
    borderRadius: 15,
  },
  nextButton: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: colors.tertiary,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignSelf: 'center',
  },
  nextButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
});
