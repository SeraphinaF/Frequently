import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/src/styles/colors';
import SoundIcon from './ui/SoundIcon';
import { Audio } from 'expo-av';
import FeedbackButtons from './FeedbackButtons';

interface CardBackProps {
    card: any;
    isFlipped: boolean;
    handleUserFeedback: (level: 1 | 2 | 3 | 4) => void;
}

export default function CardBack({ card, isFlipped, handleUserFeedback }: CardBackProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

    async function playSound() {
        try {
            if (sound) {
                await sound.unloadAsync();
                setSound(undefined);
            }
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: card.spanish_audio_url },
                { shouldPlay: true }
            );
            setSound(newSound);

            newSound.setOnPlaybackStatusUpdate(status => {
                if (!status.isPlaying) {
                    newSound.unloadAsync();
                    setSound(undefined);
                }
            });
        } catch (error) {
            console.error('Audio playback error:', error);
        }
    }

    React.useEffect(() => {
        if (isFlipped && imageLoaded) {
            playSound();
        }
    }, [isFlipped, imageLoaded]);

    const renderHighlightedExample = () => {
        const word = card.spanish_word.trim();
        const example = card.spanish_example;
        const regex = new RegExp(`(${word})`, 'i');
        const parts = example.split(regex);

        return (
            <Text style={styles.exampleForeign}>
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
                    opacity: isFlipped && imageLoaded ? 1 : 0,
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
                    <View style={styles.wordContainer}>
                        <Text style={styles.spanishWord}>{card.spanish_word}</Text>
                        <TouchableOpacity style={styles.soundIcon} onPress={playSound}>
                            <SoundIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                    {renderHighlightedExample()}
                    <Text style={styles.exampleNative}>{card.dutch_example}</Text>
                    <View style={styles.feedbackContainer}>
                        <FeedbackButtons
                            cardId={card.id}
                            onFeedbackComplete={() => { }}
                            handleUserFeedback={(quality) => handleUserFeedback(quality)}
                            nextCard={() => {
                                throw new Error('Function not implemented.');
                            }}
                        />
                    </View>
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
    image: {
        marginTop: 48,
        width: '100%',
        height: '45%',
        borderRadius: 15,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    soundIcon: {
        paddingBottom: 24,
        paddingLeft: 4,
    },
    spanishWord: {
        paddingLeft: 16,
        fontSize: 64,
        fontWeight: '500',
        color: colors.tertiary,
        marginTop: 16,
        marginBottom: 8,
    },
    exampleForeign: {
        color: colors.tertiary,
        fontSize: 20,
        fontWeight: '300',
        marginBottom: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    boldWord: {
        fontWeight: '600',
        fontStyle: 'italic',
        color: colors.tertiary,
    },
    exampleNative: {
        color: colors.tertiary,
        fontSize: 20,
        fontWeight: '200',
        fontStyle: 'italic',
        textAlign: 'center',
    },
    feedbackContainer: {
        position: 'absolute',
        bottom: 0,
    },
});
