import {StyleSheet} from 'react-native'

export const globalStyles= StyleSheet.create({
    root:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#171717",
        display:'flex'
    },
    card: {
        elevation: 4,
        backgroundColor: '#2B2B2B',
        marginHorizontal: 10,
        marginTop: 10,
        zIndex:1
    },
    heading: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 5
    }
})

export const Colors = {
    green: '#368900',
    red:'#DB4040',
    orange:'#FF7043'
}