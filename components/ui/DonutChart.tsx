import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



const DonutChart = ({
  percentage = 75,
  radius = 130,
  strokeWidth = 25,
  color = "#F72585",
  textColor = "#FFFBF1"
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
            stroke="#eee"
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
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      <Text
        style={{
          position: 'absolute',
          fontSize: 64,
          fontWeight: '500',
          color: textColor,
        }}
      >
        {percentage}%
      </Text>
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
  
        const reviewedCards = cards.filter(card => card.lastReviewedDate != null);
  
        if (reviewedCards.length === 0) {
          setPercentage(0);
          await AsyncStorage.setItem('@user_progress_percentage', '0');
          return;
        }
  
        const easyCards = reviewedCards.filter(card => card.easinessFactor >= 2.3);
        const calculatedPercentage = Math.round((easyCards.length / totalCards) * 100);
  
        setPercentage(calculatedPercentage);
        await AsyncStorage.setItem('@user_progress_percentage', calculatedPercentage.toString());
      } catch (error) {
        console.error("Error fetching user progress:", error);
      }
    };
  
    fetchProgress();
  }, [currentUser]);  

  return <DonutChart percentage={percentage} />;
};

export default ProgressDonut;
