import React from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/styles/colors';
import SoundIcon from '@/components/ui/SoundIcon';

interface CardBackProps {
    card: any;
    isFlipped: boolean;
    backInterpolate: Animated.AnimatedInterpolation<string>;
    nextCard: () => void;
}

export default function CardBack({ card, isFlipped, backInterpolate, nextCard }: CardBackProps) {
    return (
        <Animated.View
            style={[
                styles.card,
                {
                    transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
                    opacity: isFlipped ? 1 : 0,
                },
            ]}
        >
            <Image source={{ uri: card.image_url }} style={styles.image} />
            <View style={styles.wordContainer}>
                <Text style={styles.wordBack}>{card.spanish_word}</Text>
                <SoundIcon />
            </View>
            <Text style={styles.exampleForeign}>{card.spanish_example}</Text>
            <Text style={styles.exampleNative}>{card.dutch_example}</Text>
            <View style={styles.nextButtons}>
                <TouchableOpacity onPress={nextCard} style={styles.prevButton}>
                    <Text style={styles.prevButtonText}>Terug</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextCard} style={styles.nextButton}>
                    <Text style={styles.nextButtonText}>Volgende kaart</Text>
                </TouchableOpacity>
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
    image: {
        width: '100%',
        height: '50%',
        borderRadius: 15,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    wordBack: {
        fontSize: 72,
        color: colors.tertiary,
        marginRight: 20,
    },
    exampleForeign: {
        color: colors.tertiary,
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 8,
    },
    exampleNative: {
        color: colors.tertiary,
        fontSize: 18,
        fontWeight: '300',
        fontStyle: 'italic',
    },
    nextButtons: {
        position: 'absolute',
        bottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 12,
        paddingHorizontal: 8,
    },
    prevButton: {
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderColor: colors.secondary,
    },
    prevButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.secondary,
    },
    nextButton: {
        borderRadius: 12,
        backgroundColor: colors.secondary,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
    },
});
