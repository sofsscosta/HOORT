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
        top: 0,
        height: 600,
        width: 350,
        bottom: 200,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 20
    },
    title: {
        color: 'rgb(135, 135, 135)',
        bottom: '73%',
        fontSize: 20,
        lineHeight: 50,
        zIndex: 20,
        position: 'absolute',
        flex: 0.05,
        textAlign: 'center',
    },
    description: {
        color: 'rgb(135, 135, 135)',
        bottom: '70%',
        fontSize: 12,
        zIndex: 20,
        position: 'absolute',
        width: 300,
        flex: 0.05,
        textAlign: 'center',
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
    create: {
        bottom: '140%',
        fontSize: 30,
        color: 'white'
    },
    lands_container: {
        position: 'absolute',
        zIndex: 20,
        top: '33%'
    },
})

export default styles