import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { colors } from '@/src/styles/colors';
import { Link } from 'expo-router';

interface ProgressBarProps {
    totalCards: number;
    remainingCards: number;
}

export default function ProgressBar({ totalCards, remainingCards }: ProgressBarProps) {
    const progress = (totalCards - remainingCards) / totalCards;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <View style={styles.progressOuterWrapper}>
                    <View style={[styles.progressWrapper, { width: `${progress * 100}%` }]}>
                        <View style={styles.progressBar} />
                    </View>
                </View>
                <View style={styles.closeBtn}>
                    <Text><Link href='/homeScreen'>X</Link></Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center', 
        gap: 10, 
    },
    progressOuterWrapper: {
        flex: 1, 
        padding: 2,
        backgroundColor: colors.white,
        borderRadius: 20,
    },
    progressWrapper: {
        height: 20,
        width: '100%',
        backgroundColor: colors.greyLight,
        borderRadius: 15,
        overflow: 'hidden',
    },
    progressBar: {
        flex: 1,
        backgroundColor: colors.secondary,
    },
    closeBtn: {
        backgroundColor: colors.greyLight,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
});
