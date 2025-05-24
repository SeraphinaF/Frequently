import { useRef, useState, useEffect } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
    TouchableOpacity,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { colors } from '@/src/styles/colors';
import SoundIcon from '@/components/ui/SoundIcon';
import BaseLayout from '@/components/ui/BaseLayout';
import ProgressBar from '@/components/ui/ProgressBar';
import PopupMessage from '@/components/ui/popupMessage';

export default function Flashcard() {
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [popupText, setPopupText] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [additionalText, setAdditionalText] = useState('');
    const [boldText, setBoldText] = useState('');
    const [additionalTextStyle, setAdditionalTextStyle] = useState({});
    const [messageStyle, setMessageStyle] = useState({});
    const [showNextButton, setShowNextButton] = useState(false);

    const handleFeedback = (level: 'easy' | 'difficult' | 'wrong') => {
        let message = '';
        let messageStyle = {};
        let additionalText = '';
        let additionalTextStyle = {};
        let boldText = '';

        switch (level) {
            case 'easy':
                message = 'Goed gedaan!';
                messageStyle = { color: 'green', fontSize: 22 };
                additionalText = 'We herhalen deze kaart weer over ';
                additionalTextStyle = { color: 'black', fontSize: 15 };
                boldText = '12 dagen';
                break;
            case 'difficult':
                message = 'Blijf oefenen!';
                messageStyle = { color: 'orange', fontSize: 22 };
                additionalText = 'We herhalen deze kaart weer over';
                additionalTextStyle = { color: 'black', fontSize: 15 };
                boldText = '4 dagen';
                break;
            case 'wrong':
                message = 'Helaas!';
                messageStyle = { color: 'red', fontSize: 22 };
                additionalText = 'We herhalen deze kaart weer over';
                additionalTextStyle = { color: 'black', fontSize: 15 };
                boldText = '2 dagen';
                break;
        }

        setPopupText(message);
        setShowPopup(true);
        setAdditionalText(additionalText);
        setBoldText(boldText);
        setAdditionalTextStyle(additionalTextStyle);
        setMessageStyle(messageStyle);
        setShowNextButton(true); 
    };

    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipCard = () => {
        setIsFlipped((prev) => !prev);
        Animated.spring(animatedValue, {
            toValue: isFlipped ? 0 : 180,
            useNativeDriver: false,
            friction: 8,
            tension: 10,
        }).start();
    };

    const nextCard = () => {
        setIsFlipped(false);
        animatedValue.setValue(0);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
        setShowPopup(false);
        setShowNextButton(false);
    };

    useEffect(() => {
        const fetchCards = async () => {
            const querySnapshot = await getDocs(collection(db, 'cards'));
            const fetchedCards: any[] = [];
            querySnapshot.forEach((doc) => {
                fetchedCards.push(doc.data());
            });
            setCards(fetchedCards);
        };

        fetchCards();
    }, []);

    if (cards.length === 0) return <Text>Loading...</Text>;
    
    const card = cards[currentCardIndex];

    return (
        <BaseLayout>
            {cards.length > 0 && (
                <ProgressBar
                    totalCards={cards.length}
                    remainingCards={cards.length - currentCardIndex - 1}
                />
            )}
            <PopupMessage
                message={popupText}
                additionalText={additionalText}
                boldText={boldText}
                visible={showPopup}
                messageStyle={messageStyle}
                additionalTextStyle={additionalTextStyle}
                onClose={() => setShowPopup(false)}
            />
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (!isFlipped) flipCard();
                    }}
                >
                    {/* Front Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
                                opacity: isFlipped ? 0 : 1,
                            },
                        ]}
                    >
                        <Text style={styles.dutchWord}>{card.dutch_word}</Text>
                        <View style={styles.feedbackButtons}>
                        {!showNextButton ? (
                            <>
                                <Text
                                    style={styles.buttonWrong}
                                    onPress={() => handleFeedback('wrong')}
                                >
                                    Fout
                                </Text>
                                <Text
                                    style={styles.buttonDifficult}
                                    onPress={() => handleFeedback('difficult')}
                                >
                                    Moeilijk
                                </Text>
                                <Text
                                    style={styles.buttonEasy}
                                    onPress={() => handleFeedback('easy')}
                                >
                                    Makkelijk
                                </Text>
                            </>
                        ) : (
                            <View style={styles.nextButtons}>
                                <TouchableOpacity onPress={nextCard} style={styles.prevButton}>
                                <Text style={styles.nextButtonText}>vorige</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={nextCard} style={styles.nextButton}>
                                    <Text style={styles.nextButtonText}>Volgende kaart</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    </Animated.View>
                </TouchableWithoutFeedback>

                {/* Back Card */}
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

                    {/* Show feedback buttons or next button */}
                    <View style={styles.feedbackButtons}>
                        {!showNextButton ? (
                            <>
                                <Text
                                    style={styles.buttonWrong}
                                    onPress={() => handleFeedback('wrong')}
                                >
                                    Fout
                                </Text>
                                <Text
                                    style={styles.buttonDifficult}
                                    onPress={() => handleFeedback('difficult')}
                                >
                                    Moeilijk
                                </Text>
                                <Text
                                    style={styles.buttonEasy}
                                    onPress={() => handleFeedback('easy')}
                                >
                                    Makkelijk
                                </Text>
                            </>
                        ) : (
                            <View style={styles.nextButtons}>
                                <TouchableOpacity onPress={nextCard} style={styles.prevButton}>
                                <Text style={styles.nextButtonText}>vorige</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={nextCard} style={styles.nextButton}>
                                    <Text style={styles.nextButtonText}>Volgende kaart</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </View>
        </BaseLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        zIndex: 0,
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: 650,
        backgroundColor: colors.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        padding: 16,
        zIndex: 10,
    },
    dutchWord: {
        fontSize: 64,
        color: colors.primary,
    },
    image: {
        width: '100%',
        height: 350,
        borderRadius: 15,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    wordBack: {
        fontSize: 54,
        textDecorationLine: 'underline',
        color: colors.secondary,
        marginBottom: 16,
    },
    exampleForeign: {
        color: colors.black,
        fontSize: 20,
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 12,
    },
    exampleNative: {
        color: colors.black,
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: '200',
        textAlign: 'center',
        marginBottom: 36,
    },
    feedbackButtons: {
        flexDirection: 'row',
        marginTop: 24,
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonWrong: {
        color: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#CE3030',
        borderRadius: 15,
    },
    buttonDifficult: {
        color: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FE7A0F',
        borderRadius: 15,
    },
    buttonEasy: {
        color: colors.white,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#356E33',
        borderRadius: 15,
    },
    nextButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 15,
    },
    nextButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    prevButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 15,
    },
    nextButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'right',    
        justifyContent: 'right',
        textAlign: 'right',
    },
});
