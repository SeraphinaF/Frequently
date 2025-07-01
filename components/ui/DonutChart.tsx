import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



const DonutChart = ({
  percentage = 75,
  radius = 120,
  strokeWidth = 25,
  color = "#F72585",
  textColor = "#0C1049",
  fontFamily = "Nunito",
}) => {
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: radius * 2,
        height: radius * 2,
        position: 'relative',
      }}
    >
      <Svg width={radius * 2} height={radius * 2}>
        <G rotation="-90" origin={`${radius}, ${radius}`}>
          <Circle
            stroke="rgba(0, 0, 0, 0.1)"
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            stroke={color}
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            // strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <Text
        style={{
          position: 'absolute',
          fontSize: 40,
          fontWeight: '700',
          color: textColor,

        }}
      >
        {percentage}%
      </Text>
      <Text
        style={{
          position: 'absolute',
          marginTop: 80,
          fontSize: 18,
          fontWeight: '400',
          color: textColor,
          fontFamily: fontFamily,
        }}>Compleet</Text>
    </View>
  );
};

const ProgressDonut = () => {
  const [percentage, setPercentage] = useState(0);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const loadCachedPercentage = async () => {
      const cached = await AsyncStorage.getItem('@user_progress_percentage');
      if (cached !== null) setPercentage(parseInt(cached, 10));
    };

    loadCachedPercentage();

    const fetchProgress = async () => {
      if (!currentUser?.uid) return;

      try {
        const userProgressQuery = query(
          collection(db, 'userCardProgress'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(userProgressQuery);
        const cards = snapshot.docs.map(doc => doc.data());

        const totalCardsSnapshot = await getDocs(collection(db, 'cards'));
        const totalCards = totalCardsSnapshot.size;

        if (totalCards === 0) return;

        // ✅ Only include cards with easinessFactor >= 2.4 AND lastQuality === 1
        const qualifyingCards = cards.filter(
          card =>
            typeof card.easinessFactor === 'number' &&
            typeof card.lastQuality === 'number' &&
            card.easinessFactor >= 2.4 &&
            card.lastQuality === 1
        );

        const calculatedPercentage = Math.round((qualifyingCards.length / totalCards) * 100);

        setPercentage(calculatedPercentage);
        await AsyncStorage.setItem('@user_progress_percentage', calculatedPercentage.toString());
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchProgress();
  }, [currentUser]);

  return <DonutChart percentage={percentage} />;
};

export default ProgressDonut;
