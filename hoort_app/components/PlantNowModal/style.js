import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        zIndex: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(300, 300, 300, 0.5)',
    },
    inside_container: {
        alignSelf: 'center',
        height: '59%',
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 20
    },
    container_border: {
        position: 'absolute',
        maxHeight: '35%',
        width: '100%',
        alignSelf: 'center',
    },
    title: {
        color: 'rgb(135, 135, 135)',
        bottom: '75%',
        paddingLeft: '5%',
        fontSize: 30,
        position: 'absolute',
        width: '95%',
        textAlign: 'center',
        fontWeight: '200'
    },
    button: {
        width: '100%',
        height: '100%',
        bottom: '70%',
        tintColor: 'rgb(126, 194, 144)',
    },
    button_container: {
        top: '74%',
        height: '8%',
        width: '50%',
        alignSelf: 'center',
        alignItems: 'center'
    },
    state: {
        bottom: '57%',
        fontSize: 30,
        zIndex: 20,
        width: 200,
        flex: 0.05,
        textAlign: 'center'
    },
    create: {
        fontSize: 30,
    },
    results_container: {
        top: 150,
        paddingHorizontal: '5%',
        marginBottom: '45%'
    }
})

export default styles