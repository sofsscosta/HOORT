import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    submit: {
        backgroundColor: 'rgb(206, 175, 223)',
        width: 250,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        color: 'white'
    },
    redirect: {
        backgroundColor: 'lightgrey',
        width: 250,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    planted: {
        backgroundColor: 'rgb(126, 194, 144)',
        width: 250,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        marginTop: 10,
        alignItems: 'center'
    },
    notPlanted: {
        backgroundColor: 'red',
        width: 250,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        marginTop: 10,
        alignItems: 'center'
    },
    text: {
        fontSize: 20,
        color: 'rgb(90, 90, 90)',
        width: 250,
        textAlign: 'center',
        paddingRight: 10,
        paddingLeft: 10,
    }
})

export default styles