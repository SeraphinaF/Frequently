import { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { collection } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { colors } from '@/src/styles/colors';
import ProgressBar from '@/components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import { getAuth } from 'firebase/auth';
import generateSessionCards from '@/generateSessionCards';
import { useNavigation } from "@react-navigation/native";

export default function Flashcard() {
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchSession = async () => {
            if (!user || !user.uid) {
                return;
            }
            const userId = user.uid;
            const userProgressRef = collection(db, 'userCardProgress');
            const cardRef = collection(db, 'cards');

            try {
                const sessionCards = await generateSessionCards(userProgressRef, cardRef, userId);

                const preloadPromises = sessionCards.map(async (card) => {
                    try {
                        if (card.image_url && typeof card.image_url === 'string') {
                            await Image.prefetch(card.image_url);
                        }
                        return new Promise((resolve) => {
                            Image.getSize(
                                card.image_url,
                                () => {
                                    resolve();
                                },
                                (error) => {
                                    resolve();
                                }
                            );
                        });
                    } catch (err) {
                        console.warn('Image preload error:', err);
                    }
                });

                await Promise.all(preloadPromises);
                console.log('All images preloaded and measured');
                setCards(sessionCards);
            } catch (error) {
                console.error('Error fetching session cards:', error);
            }
        };

        fetchSession();
    }, [user]);

  const handleUserFeedback = () => {
    setIsFlipped(false); 
};


    const flipCard = () => {
        setIsFlipped(true);
    };

    const advanceCard = () => {
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
        setIsFlipped(false);
    };

    const card = cards[currentCardIndex];

    if (!card) {
        console.log('No card to display yet, showing spinner');
        return (
            <SafeAreaView style={styles.spinner}>
                <ActivityIndicator size="large" color={colors.tertiary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar
                totalCards={cards.length}
                remainingCards={cards.length - currentCardIndex - 1}
            />
            <View>
                {isFlipped ? (
                    <CardBack
                    card={card}
                    isFlipped={isFlipped}
                    handleUserFeedback={(quality) => {
                        advanceCard();  
                    }}
                    />
                ) : (
                    <CardFront
                    card={card}
                    isFlipped={isFlipped}
                    flipCard={flipCard}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
        backgroundColor: colors.white,
        padding: 16,
    },
    spinner: {
        flex: 1,
        justifyContent: 'center',
    },
});
