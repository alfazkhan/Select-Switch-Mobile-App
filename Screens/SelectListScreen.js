import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { FlatList, ScrollView, } from 'react-native-gesture-handler'
import { connect } from 'react-redux'
import * as SQLite from 'expo-sqlite';



class SelectListScreen extends Component {

    state = {
        lists: [],
        listType: this.props.navigation.getParam('listType')
    }

    componentDidMount() {
        const db = SQLite.openDatabase('SelectSwitch.db')
        db.transaction((txn) => {
            txn.executeSql(`SELECT * FROM lists`,
                [],
                (_, result) => {

                    const lists = result.rows._array
                    console.log(lists) 
                    this.setState({
                        lists: lists
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
            <ScrollView style={styles.container}>
                {this.state.lists.map((list) => {
                    if (list.listType !== this.state.listType) {
                        return null
                    }
                    return (
                        <TouchableOpacity key={Math.random() * 1000} onPress={() => this.props.navigation.navigate({
                            routeName: 'Result', params: {
                                listName: list.listName,
                                listType: this.props.navigation.getParam('listType')
                            }
                        })}>
                            <View>
                                <Text style={styles.listItem} key={Math.random()} > {list.listName} </Text>
                            </View>
                        </TouchableOpacity>
                    )
                })}

                <Button style={styles.button} title="Create New List" onPress={() => {
                    this.props.navigation.navigate({
                        routeName: 'CreateEdit',
                        params: {
                            mode: 'create',
                            listType: this.props.navigation.getParam('listType')
                        }
                    })
                }} />
            </ScrollView>
        )
    }
}

SelectListScreen.navigationOptions = (navData) => {
    const title = navData.navigation.getParam('listType')
    return {
        headerTitle: title === 'random' ? 'Random Selction' : 'Logical Selection'
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
    }
})



const mapStateToProps = (state) => ({
    lists: state.lists
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SelectListScreen)
