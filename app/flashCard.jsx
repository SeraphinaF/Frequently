import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { collection } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { colors } from '@/src/styles/colors';
import ProgressBar from '@/components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';
import { getAuth } from 'firebase/auth';
import generateSessionCards from '@/generateSessionCards';
import HorizontalLogo from '@/components/ui/HorizontalLogo';
import { StatusBar } from 'expo-status-bar';
import BaseLayout from '@/components/ui/BaseLayout';

export default function Flashcard() {
    const [session, setSession] = useState(null);
    const [currentCard, setCurrentCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const auth = getAuth();
    const user = auth.currentUser;

    // Track component mounted state to avoid setting state after unmount
    const mounted = useRef(true);
    useEffect(() => {
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        const fetchSession = async () => {
            if (!user || !user.uid) return;

            const userId = user.uid;
            const userProgressRef = collection(db, 'userCardProgress');
            const cardRef = collection(db, 'cards');

            try {
                const sessionInstance = await generateSessionCards(userProgressRef, cardRef, userId);
                const firstCard = sessionInstance.getNextCard();

                if (mounted.current) {
                    setSession(sessionInstance);
                    setCurrentCard(firstCard);
                }
            } catch (error) {
                console.error('Error fetching session cards:', error);
            }
        };

        fetchSession();
    }, [user]);

    useEffect(() => {
        if (!session) return;

        const intervalId = setInterval(() => {
            if (!mounted.current) return;
            if (!currentCard) {
                const next = session.getNextCard();
                if (next) {
                    setCurrentCard(next);
                    setIsFlipped(false);
                }
            }
        }, 2000);

        return () => clearInterval(intervalId);
    }, [session, currentCard]);

    const handleUserFeedback = (quality) => {
        if (!session || !currentCard) return;

        session.getFeedback(currentCard.id, quality, currentCard);

        const next = session.getNextCard();
        setCurrentCard(next);
        setIsFlipped(false);
    };

    if (!currentCard) {
        return (
            <BaseLayout>
                <SafeAreaView style={styles.spinnerScreen}>
                    <StatusBar style="light" />
                    <View style={styles.logo}>
                        <HorizontalLogo width={300} height={200} />
                    </View>
                    <ActivityIndicator size="large" color={colors.white} />
                </SafeAreaView>
            </BaseLayout>
        );
    }

    // if (session && session.getQueueLength() === 0) {
    //     return (
    //         <BaseLayout>
    //             <SafeAreaView style={styles.completeScreen}>
    //                 <StatusBar style="dark" />
    //                 <HorizontalLogo width={300} height={120} />
    //                 <Text style={styles.completeTitle}>Goed gedaan!</Text>
    //                 <Text style={styles.completeText}>
    //                     Je hebt deze sessie voltooid. Morgen staat er weer een nieuwe voor je klaar.
    //                 </Text>
    //                 <TouchableOpacity onPress={() => navigation.navigate('homeScreen')}>
    //                     <Text style={{ color: colors.primary, fontSize: 16, marginTop: 24 }}>
    //                         Terug naar home
    //                     </Text>
    //                 </TouchableOpacity>
    //             </SafeAreaView>
    //         </BaseLayout>
    //     );
    // }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ProgressBar
                totalCards={20}
                remainingCards={session ? session.getQueueLength() : 0}
            />
            <View>
                {isFlipped ? (
                    <CardBack
                        card={currentCard}
                        isFlipped={isFlipped}
                        handleUserFeedback={handleUserFeedback}
                    />
                ) : (
                    <CardFront
                        card={currentCard}
                        isFlipped={isFlipped}
                        flipCard={() => setIsFlipped(true)}
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
    spinnerScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        position: 'absolute',
        top: 175,
    },
    completeScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
        padding: 24,
    },
    completeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 32,
    },
    completeText: {
        fontSize: 18,
        color: colors.tertiary,
        marginTop: 12,
        textAlign: 'center',
    },
});
