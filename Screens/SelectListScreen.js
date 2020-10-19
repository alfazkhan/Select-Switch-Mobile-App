import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Dimensions } from 'react-native'
import { FlatList, ScrollView, } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../Components/CustomButton';
import { globalStyles } from '../Styles/GlobalStyles';



class SelectListScreen extends Component {

    state = {
        lists: [],
        listType: this.props.navigation.getParam('listType'),
        loaded: false,
    }

    componentDidMount() {

        const db = SQLite.openDatabase('SelectSwitch.db')
        db.transaction((txn) => {
            txn.executeSql(`SELECT * FROM lists`,
                [],
                (_, result) => {

                    const lists = result.rows._array
                    // console.log(lists)
                    this.setState({
                        lists: lists,
                        loaded: true
                    })

                },
                (_, err) => {
                    console.log(err)
                }
            )
        })

    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={globalStyles.heading}>Choose List</Text>
                <ScrollView >
                    {this.state.lists.map((list) => {
                        if (list.listType !== this.state.listType) {
                            return null
                        }
                        return (
                            <TouchableOpacity key={list.id} onPress={() => {
                                // this.props.navigation.pop()
                                this.props.navigation.navigate({
                                    routeName: 'Result', params: {
                                        listName: list.listName,
                                        listType: this.props.navigation.getParam('listType'),
                                        id: list.id
                                    }
                                })
                            }
                            }>
                                <View>
                                    <Text style={styles.listItem} key={Math.random()} > {list.listName} </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}

                    {/* <Button style={styles.button} title="Create New List" onPress={() => {
                    // this.props.navigation.pop()
                    this.props.navigation.navigate({
                        routeName: 'CreateEdit',
                        params: {
                            mode: 'create',
                            listType: this.props.navigation.getParam('listType')

                        }
                    })
                }} /> */}
                </ScrollView>
                <CustomButton text="Create New List"
                    Press={() => {
                        // this.props.navigation.pop()
                        this.props.navigation.navigate({
                            routeName: 'CreateEdit',
                            params: {
                                mode: 'create',
                                listType: this.props.navigation.getParam('listType')

                            }
                        })
                    }}
                    style={{ marginTop: 20, flex: 1, justifyContent: 'center' }}
                    marginHorizontal= {Dimensions.get('screen').width < 400 ? 10 : 20}
                    // height={Dimensions.get('screen').width < 350 ? 40 :50}
                />
            </View>

        )
    }
}

SelectListScreen.navigationOptions = (navData) => {
    const title = navData.navigation.getParam('listType')
    // console.log(title)
    return {
        headerTitle: title === 'random' ? 'Random Selction' : title === 'logical' ? 'Logical Selection' : 'Error',
        headerLeft: () => (
            <View style={styles.backIcon} >
                <Ionicons name="md-arrow-back" size={24} color="white" onPress={() => {
                    navData.navigation.popToTop()
                }
                }
                />
            </View>
        )
    }
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
    list: {
        marginTop: 20,
        height: 'auto'
    },
    button: {
        marginHorizontal: 40
    },
    backIcon: {
        marginLeft: Dimensions.get('screen').width < 400 ? 10 : 20
    }
})



const mapStateToProps = (state) => ({
    lists: state.lists
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SelectListScreen)
