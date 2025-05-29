import { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { colors } from '@/src/styles/colors';
import ProgressBar from '@/components/ProgressBar';
import PopupMessage from '@/components/popupMessage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardFront from '@/components/CardFront';
import CardBack from '@/components/CardBack';


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
    const [isImageLoaded, setIsImageLoaded] = useState(false);
 
    useEffect(() => {
        const fetchCards = async () => {
            const querySnapshot = await getDocs(collection(db, 'cards'));
            const fetchedCards = querySnapshot.docs.map(doc => ({
                id: doc.id,      
                ...doc.data(),
            }));
            setCards(fetchedCards);
        };
        fetchCards();
    }, []);

    const handleFeedback = async (level: '1' | '2' | '3' | '4') => {
      
        try {
          await updateUserCardProgress({
            userId: user.uid,
            cardId: card.id,
            quality: parseInt(level),
        });
        let message = '';
        let messageStyle = {};
        let additionalText = '';
        let additionalTextStyle = {};
        let boldText = '';

        switch (level) {
            case '1':
                message = 'Goed gedaan!';
                messageStyle = { color: 'green', fontSize: 22 };
                additionalText = 'We herhalen deze kaart weer over ';
                additionalTextStyle = { color: 'black', fontSize: 15 };
                boldText = '12 dagen';
                break;
            case '2':
                message = 'Blijf oefenen!';
                messageStyle = { color: 'orange', fontSize: 22 };
                additionalText = 'We herhalen deze kaart weer over';
                additionalTextStyle = { color: 'black', fontSize: 15 };
                boldText = '4 dagen';
                break;
            case '3':
                message = 'Helaas!';
                messageStyle = { color: 'red', fontSize: 22 };
                additionalText = 'We herhalen deze kaart weer over';
                additionalTextStyle = { color: 'black', fontSize: 15 };
                boldText = '2 dagen';
                break;
            case '4':
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
        flipCard();
    }catch (error) {
        console.error('Error updating card progress:', error);
      }
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
        Animated.spring(animatedValue, {
            toValue: isFlipped ? 0 : 180,
            useNativeDriver: false,
            friction: 8,
            tension: 10,
        }).start(() => {
            setIsFlipped(!isFlipped);
        });
    };

    const nextCard = () => {
        setIsFlipped(false);
        animatedValue.setValue(0);
        setIsImageLoaded(false);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
        setShowPopup(false);
    };

    if (cards.length === 0) return <Text>Loading...</Text>;

    const card = cards[currentCardIndex];

    return (
        <SafeAreaView style={styles.container}>
            <ProgressBar
                totalCards={cards.length}
                remainingCards={cards.length - currentCardIndex - 1}
            />
            <PopupMessage
                message={popupText}
                additionalText={additionalText}
                boldText={boldText}
                visible={showPopup}
                messageStyle={messageStyle}
                additionalTextStyle={additionalTextStyle}
                onClose={() => setShowPopup(false)}
            />
            <View>
                {isFlipped ? (
                    <CardBack
                        card={card}
                        isFlipped={isFlipped}
                        backInterpolate={backInterpolate}
                        nextCard={nextCard}
                    />
                ) : (
                    <CardFront
                        card={card}
                        isFlipped={isFlipped}
                        frontInterpolate={frontInterpolate}
                        handleFeedback={handleFeedback}
                        isImageLoaded={isImageLoaded}
                        setIsImageLoaded={setIsImageLoaded}
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
});
