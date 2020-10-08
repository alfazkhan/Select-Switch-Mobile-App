import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { FlatList, ScrollView, } from 'react-native-gesture-handler'

export default class SelectListScreen extends Component {

    state = {
        list: []
    }

    componentDidMount() {
        this.setState({
            list: [
                { key: '1', value: 'Apple' },
                { key: '2', value: 'Ball' },
                { key: '3', value: 'Cat' },
            ]
        })
    }


    render() {
        return (
            <View style={styles.container}>
                {/* {this.state.list.map((ele)=>{
                    return(
                    <Text style={{color:'#fff'}}>{ele}</Text>
                    )
                })} */}
                <FlatList
                    data={this.state.list}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate({
                            routeName: 'Result', params:{
                                listName: item.value,
                                listType: this.props.navigation.getParam('listType')
                            }
                        })}>
                            <View>
                                <Text style={styles.listItem} key={item.key} > {item.value} </Text>
                            </View>
                        </TouchableOpacity>
                    }
                    style={styles.list}
                />
                <Button style={styles.button} title="Create New List" onPress={() => {
                    this.props.navigation.navigate({
                        routeName: 'CreateEdit',
                        params: {
                            mode: 'create',
                            listType: this.props.navigation.getParam('listType')
                        }
                    })
                }} />
            </View>
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