import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import * as SQLite from 'expo-sqlite';

import { globalStyles, Colors } from '../Styles/GlobalStyles';
import CustomButton from '@/components/CustomButton';
import { fetchListItems } from '../Helper/ListItems';
import { fetchProperties } from '../Helper/Properties';

interface FinalScores {
    itemName: string;
    score: number;
}

export default function ResultScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams<{ id: string; listName: string; listType: string }>();

    const [loading, setLoading] = useState(true);
    const [calculatedResults, setCalculatedResults] = useState<FinalScores[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: params.listName || 'Selection Result',
        });

        async function evaluateList() {
            if (!params.id) return;
            try {
                const listIdNum = parseInt(params.id, 10);
                
                // Fetch Items linked to this list
                const itemsRes: any = await fetchListItems(listIdNum);
                const items = itemsRes.rows._array || [];

                if (params.listType === 'random') {
                    // Random selection algorithm
                    if (items.length > 0) {
                        const randomIndex = Math.floor(Math.random() * items.length);
                        setCalculatedResults([{ itemName: items[randomIndex].itemName, score: 100 }]);
                    }
                } else {
                    // Logical matrix evaluation layout
                    const propsRes: any = await fetchProperties(listIdNum);
                    const properties = propsRes.rows._array || [];

                    const db = await SQLite.openDatabaseAsync('SelectSwitch.db');
                    const matrixResults = [];

                    for (let item of items) {
                        let totalScore = 0;

                        for (let prop of properties) {
                            // Corrected table name typo & mapped item.id and prop.id variables
                            const relations: any[] = await db.getAllAsync(
                                'SELECT * FROM listItemProperty WHERE listItemID = ? AND propertyID = ?',
                                [item.id, prop.id]
                            );

                            let scalarModifier = 100; 
                            if (relations && relations.length > 0) {
                                scalarModifier = relations[0].value ?? 100;
                            }

                            const valueContribution = (prop.importance / 100) * scalarModifier;
                            if (prop.negative === 1) {
                                totalScore -= valueContribution;
                            } else {
                                totalScore += valueContribution;
                            }
                        }

                        matrixResults.push({
                            itemName: item.itemName,
                            score: Math.round(totalScore)
                        });
                    }

                    // Sort descending (highest matching priority elements first)
                    matrixResults.sort((a, b) => b.score - a.score);
                    setCalculatedResults(matrixResults);
                }
            } catch (err) {
                console.error("Analysis engine calculation failure:", err);
            } finally {
                setLoading(false);
            }
        }

        evaluateList();
    }, [params, navigation]);

    if (loading) {
        return (
            <View style={styles.centerMode}>
                <ActivityIndicator size="large" color={Colors.orange} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={globalStyles.heading}>Evaluation Ranking</Text>
            
            <ScrollView style={styles.scrollSpacing}>
                {calculatedResults.map((item, index) => (
                    <View 
                        key={index} 
                        style={[
                            globalStyles.card, 
                            index === 0 ? styles.topPickHighlight : null
                        ]}
                    >
                        <View style={styles.resultRow}>
                            <Text style={styles.rankText}>#{index + 1}</Text>
                            <Text style={styles.itemText}>{item.itemName}</Text>
                            {params.listType === 'logical' && (
                                <Text style={styles.scoreText}>{item.score} pts</Text>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton 
                    text="Edit List Configuration" 
                    Press={() => {
                        router.push({
                            pathname: '/CreateEdit',
                            params: { mode: 'edit', listType: params.listType, listID: params.id }
                        });
                    }}
                    marginVertical={10}
                    marginHorizontal={20}
                />
                <CustomButton 
                    text="Back to Main Menu" 
                    Press={() => router.dismissAll()} 
                    marginHorizontal={20}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#171717', paddingBottom: 20 },
    centerMode: { flex: 1, backgroundColor: '#171717', justifyContent: 'center', alignItems: 'center' },
    scrollSpacing: { flex: 1, marginTop: 10 },
    resultRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
    rankText: { color: '#FF7043', fontSize: 22, fontWeight: 'bold', width: 50 },
    itemText: { color: '#fff', fontSize: 20, flex: 1 },
    scoreText: { color: '#888', fontSize: 18, fontWeight: '600' },
    topPickHighlight: { borderColor: '#FF7043', borderWidth: 1.5 },
    footer: { marginTop: 10 }
});