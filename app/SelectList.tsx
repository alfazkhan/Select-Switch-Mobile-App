import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import { globalStyles } from '../Styles/GlobalStyles';
import { fetchAllList } from '../Helper/Lists';

interface ListEntity {
    id: number;
    listName: string;
    listType: string;
}

export default function SelectListScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { listType } = useLocalSearchParams<{ listType: string }>();
    const [lists, setLists] = useState<ListEntity[]>([]);

    useEffect(() => {
        const title = listType === 'random' ? 'Random Selection' : listType === 'logical' ? 'Logical Selection' : 'Selection';
        navigation.setOptions({ headerTitle: title });

        try {
            // op-sqlite runs synchronously; fetch data directly without async database promises
            const result = fetchAllList();
            setLists(result.rows._array);
        } catch (err) {
            console.error("Failed to fetch collections array:", err);
        }
    }, [listType, navigation]);

    return (
        <View style={styles.container}>
            <Text style={globalStyles.heading}>Choose List</Text>
            <ScrollView>
                {lists.map((list) => {
                    if (list.listType !== listType) {
                        return null;
                    }
                    return (
                        <TouchableOpacity 
                            key={list.id} 
                            onPress={() => {
                                router.push({
                                    pathname: '/Result',
                                    params: {
                                        listName: list.listName,
                                        listType: listType,
                                        id: list.id
                                    }
                                });
                            }}
                        >
                            <View>
                                <Text style={styles.listItem}>{list.listName}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <CustomButton 
                text="Create New List"
                Press={() => {
                    router.push({
                        pathname: '/CreateEdit',
                        params: { mode: 'create', listType: listType }
                    });
                }}
                style={styles.btnLayout}
                marginHorizontal={Dimensions.get('screen').width < 400 ? 10 : 20}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#171717',
        flex: 1
    },
    listItem: {
        color: '#fff',
        fontSize: 22,
        marginHorizontal: 25,
        marginVertical: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    btnLayout: { 
        marginTop: 20, 
        flex: 1, 
        justifyContent: 'center' 
    }
});