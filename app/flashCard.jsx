import { useRef, useState, useEffect } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
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
            additionalTextStyle = { color: 'black', fontSize: 12 };
            boldText = '12 dagen'; 
            break;
          case 'difficult':
            message = 'Blijf oefenen!';
            messageStyle = { color: 'orange', fontSize: 22 };
            additionalText = 'We herhalen deze kaart weer over';
            additionalTextStyle = { color: 'black', fontSize: 12, fontWeight: 'thin'};
            boldText = '4 dagen'; 
            break;
          case 'wrong':
            message = 'Niet erg — probeer het nog eens!';
            messageStyle = { color: 'red', fontSize: 22 };
            additionalText = 'We herhalen deze kaart weer over';
            additionalTextStyle = { color: 'black', fontSize: 12, fontWeight: 'thin' };
            boldText = '2 dagen'; 
            break;
        }
      
        setPopupText(message);
        setShowPopup(true);
        setAdditionalText(additionalText); 
        setBoldText(boldText); 
        setAdditionalTextStyle(additionalTextStyle); 
        setMessageStyle(messageStyle);
        nextCard();
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
    };

    useEffect(() => {
        const fetchCards = async () => {
            const querySnapshot = await getDocs(collection(db, 'cards'));
            const fetchedCards = [];
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
            <ProgressBar totalCards={0} remainingCards={0} />
            <PopupMessage
                message={popupText}
                additionalText={additionalText}
                boldText={boldText}
                visible={showPopup}
                messageStyle={messageStyle} 
                additionalTextStyle={additionalTextStyle}
                onClose={() => setShowPopup(false)}
            />
            <TouchableWithoutFeedback onPress={flipCard}>
                <View style={styles.container}>
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
                        <Text style={styles.word}>{card.dutch_word}</Text>
                    </Animated.View>

                    {/* Back Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            styles.backCard,
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
                        <View style={styles.feedbackButtons}>
                            <Text style={styles.buttonWrong} onPress={() => handleFeedback('wrong')}>Fout</Text>
                            <Text style={styles.buttonDifficult} onPress={() => handleFeedback('difficult')}>Moeilijk</Text>
                            <Text style={styles.buttonEasy} onPress={() => handleFeedback('easy')}>Makkelijk</Text>
                        </View>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </BaseLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    card: {
        position: 'absolute',
        width: 350,
        height: 400,
        backgroundColor: colors.white,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
    },
    backCard: {
        backgroundColor: colors.primary,
    },
    word: {
        fontSize: 48,
        color: colors.primary,
    },
    image: {
        width: 350,
        height: 350,
        borderRadius: 15,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    wordBack: {
        fontSize: 36,
        color: colors.secondary,
    },
    exampleForeign: {
        color: colors.white,
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 12,
    },
    exampleNative: {
        color: colors.white,
        fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    feedbackButtons: {
        flexDirection: 'row',
        marginTop: 24,
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonWrong: {
        color: '#CE3030',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 15,
    },
    buttonDifficult: {
        color: '#FE7A0F',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 15,
    },
    buttonEasy: {
        color: '#3E973B',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 15,
    },
});


