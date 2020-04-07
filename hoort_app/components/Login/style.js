import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    title: {
        fontSize: 45,
        marginBottom: 10,
        color: 'rgb(206, 175, 223)',
        fontWeight: '200'
    },
    subtitle: {
        fontSize: 20,
        marginTop: 30
    },
    input: {
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        height: 40,
        width: 250,
        fontSize: 25,
        borderRadius: 20,
        borderStyle: "solid",
        borderColor: 'black',
        marginTop: 20
    },
    feedback: {
        position: 'absolute',
        top: '80%'
    }
})

export default styles