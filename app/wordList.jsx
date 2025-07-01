import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
    doc,
    getDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/FirebaseConfig';
import { colors } from '@/src/styles/colors';
import { StatusBar } from 'expo-status-bar';

const PAGE_SIZE = 20;

export default function WordListScreen() {
    const navigation = useNavigation();
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [lastVisible, setLastVisible] = useState(null);

    const auth = getAuth();
    const user = auth.currentUser;

    const getDifficultyLabel = (quality) => {
        if (quality === 1) return { label: 'Makkelijk', color: '#4CAF50' };
        if (quality === 2 || quality === 3) return { label: 'Gemiddeld', color: '#FFC107' };
        if (quality === 4) return { label: 'Moeilijk', color: '#F44336' };
        return null;
    };

    const fetchUserProgress = async (userId, cardIds) => {
        const progressData = {};
        const promises = cardIds.map(async (cardId) => {
            const docId = `${userId}_${cardId}`;
            const progressDoc = await getDoc(doc(db, 'userCardProgress', docId));
            if (progressDoc.exists()) {
                const data = progressDoc.data();
                progressData[cardId] = {
                    quality: data.quality ?? null,
                    lastReviewedDate: data.lastReviewedDate ?? null,
                };
            }
        });
        await Promise.all(promises);
        return progressData;
    };

    const fetchCards = async (loadMore = false) => {
        if (!user || loading || loadingMore) return;

        loadMore ? setLoadingMore(true) : setLoading(true);

        try {
            const cardRef = collection(db, 'cards');
            let q = query(cardRef, orderBy('index_id'), limit(PAGE_SIZE));

            if (loadMore && lastVisible) {
                q = query(
                    cardRef,
                    orderBy('index_id'),
                    startAfter(lastVisible),
                    limit(PAGE_SIZE)
                );
            }

            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const newCards = snapshot.docs.map((docSnap) => ({
                    card_id: docSnap.id,
                    ...docSnap.data(),
                }));

                const cardIds = newCards.map((card) => card.card_id);
                const progressMap = await fetchUserProgress(user.uid, cardIds);

                const mergedCards = newCards.map((card) => ({
                    ...card,
                    quality: progressMap[card.card_id]?.quality ?? null,
                    lastReviewedDate: progressMap[card.card_id]?.lastReviewedDate ?? null,
                }));

                mergedCards.forEach((card) =>
                    console.log(
                        `🧠 ${card.dutch_word} [${card.card_id}] → quality:`,
                        card.quality ?? 'geen data'
                    )
                );

                setCards((prev) => (loadMore ? [...prev, ...mergedCards] : mergedCards));
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
            }
        } catch (err) {
            console.error('❌ Error fetching cards:', err);
        } finally {
            loadMore ? setLoadingMore(false) : setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const renderItem = ({ item, index }) => {
        let difficulty = null;
    
        if (item.quality !== null) {
            difficulty = getDifficultyLabel(item.quality);
        } else if (item.lastReviewedDate === null && item.easinessFactor === 2.5) {
            difficulty = { label: 'nieuw', color: '#888888' }; // grijs
        } else if (item.easinessFactor !== null) {
            difficulty = getDifficultyLabel(item.easinessFactor);
        }

        return (
            <View style={styles.card}>
                <View style={styles.circleWrapper}>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>{index + 1}</Text>
                    </View>
                </View>
                {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]} />
                )}
                <View style={styles.wordsContainer}>
                    <Text style={styles.dutch}>{item.dutch_word}</Text>
                    <Text style={styles.spanish}>{item.spanish_word}</Text>
                    {difficulty && (
                        <View style={[styles.difficultyTag, { backgroundColor: difficulty.color }]}>
                            <Text style={styles.difficultyText}>{difficulty.label}</Text>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    if (loading && cards.length === 0) {
        return (
            <SafeAreaView style={styles.centered}>
                <StatusBar style="dark" />
                <ActivityIndicator size="large" color={colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←Terug</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Woordenlijst</Text>
            </View>

            <FlatList
                data={cards}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.card_id}_${index}`}
                onEndReached={() => fetchCards(true)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingMore && <ActivityIndicator />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    backButton: {
        fontSize: 18,
        color: colors.primary,
        marginRight: 16,
    },
    title: {
        marginLeft: 40,
        fontSize: 22,
        fontWeight: '600',
        color: colors.tertiary,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.lightGray,
        marginVertical: 8,
        borderRadius: 10,
    },
    index: {
        fontSize: 18,
        width: 30,
        textAlign: 'right',
        marginRight: 8,
        color: colors.primary,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#EEE',
    },
    imagePlaceholder: {
        backgroundColor: colors.borderGray,
    },
    wordsContainer: {
        flex: 1,
    },
    dutch: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.tertiary,
    },
    spanish: {
        fontSize: 16,
        color: colors.primary,
    },
    difficultyLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    difficultyTag: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 5,
        marginTop: 4,
    },
    difficultyText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    circleWrapper: {
        width: 66,
        alignItems: 'center',
        paddingRight: 40,
        position: 'relative',
    },
    verticalLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: 4,
        backgroundColor: colors.primary,
        transform: [{ translateX: -2 }],
        zIndex: 0,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 33,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginLeft: 20,
    },
    circleText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
