import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Alert } from 'react-native';
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import Checkbox from '@react-native-community/checkbox';
import * as SQLite from 'expo-sqlite';

import { globalStyles, Colors } from '../Styles/GlobalStyles';
import CustomButton from '@/components/CustomButton';
import { createListItem, deleteListItem, fetchListItems } from '../Helper/ListItems';
import { createList, fetchList, updateList } from '../Helper/Lists';
import { createProperty, fetchProperties, updateProperty, deleteProperty } from '../Helper/Properties';
import { createListItemProperty, deleteAllListItemProperties, deleteAllListItemPropertiesbyItemID, deleteAllListItemPropertiesbyPropertyID } from '../Helper/listItemProperty';

interface ItemStructure { id: string | number; itemName: string; }
interface PropertyStructure { id: string | number; propertyName: string; importance: number; info: string; negative: number; }

export default function CreateEditListScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const params = useLocalSearchParams<{ listType: string; mode: string; listID?: string }>();

    const [listName, setListName] = useState('');
    const [listItemName, setListItemName] = useState('');
    const [listItems, setListItems] = useState<ItemStructure[]>([]);
    const [listProperties, setListProperties] = useState<PropertyStructure[]>([]);
    const [loaded, setLoaded] = useState(false);
    const [deletedListItems, setDeletedListItems] = useState<number[]>([]);
    const [deletedListProperties, setDeletedListProperties] = useState<number[]>([]);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: params.mode === 'create' ? 'Create List' : 'Edit List'
        });

        async function loadData() {
            if (params.mode === 'edit' && params.listID) {
                try {
                    const db = await SQLite.openDatabaseAsync('SelectSwitch.db');
                    
                    const listRes: any = await fetchList(parseInt(params.listID));
                    const list = listRes.rows._array[0];
                    if (list) {
                        setListName(list.listName);
                    }

                    const itemsRes: any = await fetchListItems(parseInt(params.listID));
                    setListItems(itemsRes.rows._array || []);

                    if (params.listType === 'logical') {
                        const propsRes: any = await fetchProperties(parseInt(params.listID));
                        setListProperties(propsRes.rows._array || []);
                    }
                } catch (err) {
                    console.error("Failed to load list details", err);
                }
            }
            setLoaded(true);
        }
        loadData();
    }, [params]);

    const sliderValueHandler = (val: number, index: number) => {
        const updated = [...listProperties];
        updated[index].importance = Math.floor(val);
        setListProperties(updated);
    };

    const negativeValueToggle = (index: number) => {
        const updated = [...listProperties];
        updated[index].negative = updated[index].negative === 0 ? 1 : 0;
        setListProperties(updated);
    };

    const listItemSubmitHandler = () => {
        if (!listItemName.trim()) return;
        setListItems([...listItems, { itemName: listItemName, id: Date.now().toString() }]);
        setListItemName('');
    };

    const listItemDeleteHandler = (id: string | number) => {
        const index = listItems.findIndex(item => item.id === id);
        if (index === -1) return;

        Alert.alert('Delete this item?', listItems[index].itemName, [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => {
                if (typeof id === 'number') {
                    setDeletedListItems([...deletedListItems, id]);
                }
                const updated = [...listItems];
                updated.splice(index, 1);
                setListItems(updated);
            }}
        ]);
    };

    const addPropertyHandler = () => {
        if (listProperties.some(p => p.propertyName === '')) return;
        setListProperties([...listProperties, {
            propertyName: '',
            importance: 20,
            info: '',
            negative: 0,
            id: 'prop_' + Date.now().toString()
        }]);
    };

    const propertyDeleteHandler = (index: number) => {
        const prop = listProperties[index];
        Alert.alert('Delete this property?', prop.propertyName, [
            { text: "Cancel", style: "cancel" },
            { text: "OK", onPress: () => {
                if (typeof prop.id === 'number') {
                    setDeletedListProperties([...deletedListProperties, prop.id]);
                }
                const updated = [...listProperties];
                updated.splice(index, 1);
                setListProperties(updated);
            }}
        ]);
    };

    const submitHandler = async () => {
        if (!listName.trim()) {
            Alert.alert('Error!', "List Name Can't be blank");
            return;
        }
        if (params.listType === 'logical') {
            if (listProperties.length === 0) {
                Alert.alert('Error!', "Properties Can't be empty");
                return;
            }
            if (listProperties.some(p => !p.propertyName.trim())) {
                Alert.alert('Error!', "Property Name Can't be blank");
                return;
            }
        }
        if (listItems.length === 0) {
            Alert.alert('Error!', "List Items Can't be empty");
            return;
        }

        if (params.mode === 'create') {
            const listRes = await createList(listName, params.listType, true, true);
            const nativeListId = listRes.insertId;

            const finalizedItems = [];
            for (let i = 0; i < listItems.length; i++) {
                const itemRes = await createListItem(nativeListId, listItems[i].itemName);
                finalizedItems.push({ id: itemRes.insertId });
            }

            const finalizedProps = [];
            if (params.listType === 'logical') {
                for (let i = 0; i < listProperties.length; i++) {
                    const propertyRes = await createProperty(
                        nativeListId,
                        listProperties[i].propertyName,
                        listProperties[i].importance,
                        listProperties[i].info,
                        listProperties[i].negative
                    );
                    finalizedProps.push({ id: propertyRes.insertId });
                }

                for (let i = 0; i < finalizedItems.length; i++) {
                    for (let j = 0; j < finalizedProps.length; j++) {
                        await createListItemProperty(finalizedItems[i].id, finalizedProps[j].id, nativeListId, 100);
                    }
                }
            }
            router.dismiss(2);
            router.push({ pathname: '/SelectList', params: { listType: params.listType } });
        } else if (params.listID) {
            const currentListId = parseInt(params.listID);
            await updateList(listName, currentListId);

            for (let id of deletedListItems) {
                await deleteListItem(id);
                await deleteAllListItemPropertiesbyItemID(id);
            }

            const activeItemIds = [];
            for (let item of listItems) {
                if (typeof item.id !== 'number') {
                    const itemRes = await createListItem(currentListId, item.itemName);
                    activeItemIds.push(itemRes.insertId);
                } else {
                    activeItemIds.push(item.id);
                }
            }

            if (params.listType === 'logical') {
                for (let id of deletedListProperties) {
                    await deleteProperty(id);
                    await deleteAllListItemPropertiesbyPropertyID(id);
                }

                const activePropIds = [];
                for (let prop of listProperties) {
                    if (typeof prop.id === 'number') {
                        await updateProperty(prop.propertyName, prop.importance, prop.info, prop.negative, prop.id);
                        activePropIds.push(prop.id);
                    } else {
                        const propertyRes = await createProperty(currentListId, prop.propertyName, prop.importance, prop.info, prop.negative);
                        activePropIds.push(propertyRes.insertId);
                    }
                }

                await deleteAllListItemProperties(currentListId);
                for (let itemId of activeItemIds) {
                    for (let propId of activePropIds) {
                        await createListItemProperty(itemId, propId, currentListId, 100);
                    }
                }
            }

            router.dismiss(2);
            router.push({
                pathname: '/Result',
                params: { listName, listType: params.listType, id: currentListId }
            });
        }
    };

    if (!loaded) return null;

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput 
                    placeholder="List Name" 
                    placeholderTextColor="#2f2f2f" 
                    style={styles.listNameInput} 
                    onChangeText={setListName} 
                    value={listName} 
                />

                {params.listType === 'logical' && (
                    <View>
                        <Text style={globalStyles.heading}>Properties</Text>
                        {listProperties.map((item, index) => (
                            <View style={globalStyles.card} key={item.id}>
                                <View style={styles.row}>
                                    <TextInput 
                                        placeholder="Camera"
                                        placeholderTextColor="#707070"
                                        style={styles.textInput}
                                        value={listProperties[index].propertyName}
                                        onChangeText={(val) => {
                                            const updated = [...listProperties];
                                            updated[index].propertyName = val;
                                            setListProperties(updated);
                                        }}
                                    />
                                    <TouchableOpacity style={styles.propertyDeleteIcon} onPress={() => propertyDeleteHandler(index)}>
                                        <MaterialIcons name="delete" size={30} color={Colors.red} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.sliderText}>Importance</Text>
                                    <Slider
                                        style={styles.sliderWidth}
                                        minimumValue={0}
                                        maximumValue={100}
                                        minimumTrackTintColor={Colors.orange}
                                        maximumTrackTintColor="#333"
                                        thumbTintColor={Colors.orange}
                                        onValueChange={(val) => sliderValueHandler(val, index)}
                                        value={item.importance}
                                    />
                                    <Text style={styles.sliderValue}>{item.importance}</Text>
                                </View>

                                <View style={styles.rowPadding}>
                                    <Text style={styles.sliderText}>Negative Value</Text>
                                    <View style={styles.checkbox}>
                                        <Checkbox
                                            value={item.negative !== 0}
                                            onValueChange={() => negativeValueToggle(index)}
                                            tintColors={{ true: '#FF7043' }}
                                        />
                                    </View>
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity onPress={addPropertyHandler}>
                            <AntDesign name="pluscircle" size={30} color="#FF7043" style={styles.centerIcon} />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.listItemInputContainer}>
                    <TextInput 
                        placeholder="List Item" 
                        placeholderTextColor="#2f2f2f" 
                        style={styles.textInput} 
                        value={listItemName} 
                        onChangeText={setListItemName} 
                    />
                    <TouchableOpacity onPress={listItemSubmitHandler}>
                        <AntDesign name="pluscircle" size={30} color="#FF7043" style={styles.plusIcon} />
                    </TouchableOpacity>
                </View>

                <View style={globalStyles.card}>
                    {listItems.length > 0 && <Text style={globalStyles.heading}>Current List</Text>}
                    {listItems.map(item => (
                        <View style={styles.currentListItem} key={item.id}>
                            <FontAwesome name="circle" size={10} color="white" style={styles.verticalCenter} />
                            <Text style={styles.currentListText}>{item.itemName}</Text>
                            <MaterialIcons name="delete" size={22} style={styles.currentListDeleteIcon} color={Colors.red} onPress={() => listItemDeleteHandler(item.id)} />
                        </View>
                    ))}
                </View>

                <View style={styles.footerSpacing}>
                    <CustomButton text="Save" Press={submitHandler} marginVertical={10} style={styles.flexCenter} marginHorizontal={Dimensions.get('screen').width < 350 ? 10 : 20} />
                    <CustomButton text="Cancel" Press={() => router.back()} style={styles.flexCenter} marginHorizontal={Dimensions.get('screen').width < 350 ? 10 : 20} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#171717' },
    row: { flexDirection: 'row', flex: 1 },
    rowPadding: { flexDirection: 'row', flex: 1, paddingBottom: 10 },
    verticalCenter: { textAlignVertical: 'center' },
    flexCenter: { marginTop: 20, flex: 1, justifyContent: 'center' },
    centerIcon: { textAlign: 'center', marginVertical: 10 },
    sliderWidth: { height: 55, flex: 3, width: 1000 },
    footerSpacing: { marginTop: 20 },
    listNameInput: {
        color: 'white',
        fontSize: Dimensions.get('screen').width < 350 ? 14 : 20,
        marginTop: Dimensions.get('screen').width < 350 ? 10 : 40,
        marginHorizontal: Dimensions.get('screen').width < 350 ? 10 : 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    textInput: {
        color: 'white',
        fontSize: Dimensions.get('screen').width < 350 ? 14 : 20,
        marginTop: 10,
        marginHorizontal: Dimensions.get('screen').width < 350 ? 10 : 20,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        paddingBottom: 10,
        width: Dimensions.get('screen').width < 350 ? 250 : 310,
        flex: 3
    },
    listItemInputContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    plusIcon: { justifyContent: 'center', alignItems: 'center', marginTop: 20, marginRight: Dimensions.get('screen').width < 350 ? 10 : 20 },
    currentListItem: { marginLeft: 10, marginVertical: 10, flexDirection: 'row' },
    currentListText: { color: '#fff', fontSize: Dimensions.get('screen').width < 350 ? 14 : 20, textAlign: 'left', marginLeft: 10 },
    propertyDeleteIcon: { marginTop: 10, marginRight: Dimensions.get('screen').width < 350 ? 5 : 10 },
    currentListDeleteIcon: { textAlignVertical: 'center', textAlign: 'right', flex: 1, marginRight: Dimensions.get('screen').width < 350 ? 5 : 10, justifyContent: 'center' },
    sliderText: { color: '#fff', fontSize: Dimensions.get('screen').width < 350 ? 14 : 20, textAlignVertical: 'center', marginLeft: Dimensions.get('screen').width < 350 ? 5 : 10, flex: 1.5 },
    sliderValue: { color: '#fff', textAlignVertical: 'center', marginRight: Dimensions.get('screen').width < 350 ? 10 : 20, alignItems: 'flex-end' },
    checkbox: { marginRight: Dimensions.get('screen').width < 350 ? 5 : 10, flex: 1.5, alignItems: 'flex-end' }
});