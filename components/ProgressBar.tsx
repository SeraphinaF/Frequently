import React from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/src/styles/colors';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
    totalCards: number;
    remainingCards: number;
}

export default function ProgressBar({ totalCards, remainingCards }: ProgressBarProps) {
    const navigation = useNavigation()
    const progress = totalCards > 0 ? (totalCards - remainingCards) / totalCards : 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <View style={styles.progressOuterWrapper}>
                    <View style={[styles.progressWrapper, { width: `${progress * 100}%` }]}>
                        <LinearGradient
                            colors={['#A0B013', '#D1DD56', '#A0B013']}
                            style={styles.gradient}
                        >
                        </LinearGradient>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("homeScreen")} style={styles.closeBtn}>
                    <Text>X</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginBottom: -20,
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    progressOuterWrapper: {
        flex: 1, 
        padding: 6,
        backgroundColor: colors.greyLight,
        borderRadius: 20,
    },
    progressWrapper: {
        height: 14,
        width: '100%',
        borderRadius: 100,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
    },
    closeBtn: {
        backgroundColor: colors.greyLight,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 100,
    },
});
