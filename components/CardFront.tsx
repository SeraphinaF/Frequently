import React from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/src/styles/colors';
import FeedbackButtons from './FeedbackButtons';

interface CardFrontProps {
    card: any;
    isFlipped: boolean;
    frontInterpolate: Animated.AnimatedInterpolation<string>;
    handleFeedback: (level: '1' | '2' | '3' | '4') => void;
    isImageLoaded: boolean;
    setIsImageLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CardFront({
    card,
    isFlipped,
    frontInterpolate,
    handleFeedback,
    isImageLoaded,
    setIsImageLoaded,
}: CardFrontProps) {
    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                    opacity: isFlipped ? 0 : 1,
                },
            ]}
        >
            <Image
                source={{ uri: card.image_url }}
                style={styles.image}
            />
            <Text style={styles.dutchWord}>{card.dutch_word}</Text>
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTextScale}>
                    Hoe lastig vind je dit woord op een schaal van 1-4??
                </Text>
                <FeedbackButtons handleFeedback={handleFeedback} />
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: '100%',
        height: 650,
        borderRadius: 15,
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        zIndex: 10,
        marginTop: 60,
    },
    dutchWord: {
        fontSize: 72,
        color: colors.tertiary,
        marginTop: 16,
    },
    image: {
        width: '100%',
        height: '50%',
        borderRadius: 15,
    },
    feedbackContainer: {
        position: 'absolute',
        bottom: 24,
        width: '100%',
    },
    feedbackTextScale: {
        color: colors.black,
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 16,
    },
});
