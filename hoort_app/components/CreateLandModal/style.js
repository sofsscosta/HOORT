import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        zIndex: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(300, 300, 300, 0.5)'
    },
    container_border: {
        backgroundColor: 'white',
        position: 'absolute',
        maxHeight: '35%',
        width: '80%',
        alignSelf: 'center',
        bottom: -170,
    },
    title: {
        color: 'rgb(135, 135, 135)',
        bottom: '65%',
        fontSize: 30,
        zIndex: 20,
        position: 'absolute',
        width: 200,
        flex: 0.05,
        textAlign: 'center'
    },
    button: {
        width: '100%',
        height: '100%',
        bottom: '70%',
        tintColor: 'rgb(126, 194, 144)',
    },
    button_container: {
        top: '74%',
        position: 'absolute',
        zIndex: 20,
        height: '8%',
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center'
    },
    state: {
        color: 'white',
        bottom: '57%',
        fontSize: 30,
        zIndex: 20,
        position: 'absolute',
        width: 200,
        flex: 0.05,
        textAlign: 'center'
    },
    input: {
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        borderBottomEndRadius: 0,
        borderBottomStartRadius: 0,
        height: '5%',
        width: '60%',
        fontSize: 25,
        borderRadius: 20,
        borderStyle: "solid",
        borderColor: 'black',
        textAlign: 'center',
        zIndex: 20,
        marginTop: '0%',
        marginBottom: '6%'
    },
    create: {
        bottom: '140%',
        fontSize: 30,
        color: 'white'
    }
})

export default styles