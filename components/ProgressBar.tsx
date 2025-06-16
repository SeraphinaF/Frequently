import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { colors } from '@/src/styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; // You can use any icon library

interface ProgressBarProps {
    totalCards: number;
    remainingCards: number;
}

export default function ProgressBar({ totalCards, remainingCards }: ProgressBarProps) {
    const navigation = useNavigation();
    const progress = totalCards > 0 ? (totalCards - remainingCards) / totalCards : 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <View style={styles.progressOuterWrapper}>
                    <View style={[styles.progressWrapper, { width: `${progress * 100}%` }]}>
                        <LinearGradient
                            colors={['#0C1049', '#535AC3', '#0C1049']}
                            style={styles.gradient}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() =>
                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'homeScreen' }],
                        })
                      }
                >
                    <Ionicons name="close" size={20} color={colors.primaryDark} />
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
        display: 'flex',
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
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 100,
    },
});
