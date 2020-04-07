import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
    },
    title: {
        fontSize: 50,
        paddingTop: 40,
        alignSelf: 'center',
        color: 'rgb(147, 147, 147)',
    },
    button: {
        width: 250,
        height: 100,
        alignSelf: 'center',
        marginTop: 30,
    },
    button_container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 77,
        paddingRight: 15,
        paddingLeft: 30

    },
    button_text: {
        fontSize: 25,
        width: 150,
        height: 50,
        top: 13,
        color: 'white',
    },
    add: {
        height: 50,
        width: 50,
    }
})

export default styles