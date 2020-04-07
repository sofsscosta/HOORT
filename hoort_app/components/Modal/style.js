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
        position: 'relative',
        maxHeight: '50%',
        width: '80%',
        borderRadius: 30
    },
    title: {
        textDecorationLine: 'underline',
        color: 'rgb(135, 135, 135)',
        bottom: '68%',
        fontSize: 30,
        zIndex: 20,
        position: 'absolute',
        width: 230,
        flex: 0.05,
        textAlign: 'center'
    },
    button_notPlanted: {
        width: '60%',
        height: '8%',
        position: 'absolute',
        bottom: '55%',
        zIndex: 20,
        tintColor: 'rgb(360, 170, 170)',
    },
    button_planted: {
        width: '60%',
        height: '8%',
        position: 'absolute',
        bottom: '55%',
        zIndex: 20,
        tintColor: 'rgb(126, 194, 144)',
    },
    button_harvest: {
        width: '50%',
        height: '8%',
        position: 'absolute',
        bottom: '55%',
        zIndex: 20,
        tintColor: 'plum',
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
    update_button_container: {
        borderRadius: 20,
        width: 200,
        height: 30,
        zIndex: 20,
        justifyContent: 'center',
        backgroundColor: 'rgb(126, 194, 144)',
        bottom: 200,
    },
    update_button_container_planted: {
        zIndex: 20,
        justifyContent: 'center',
        bottom: 160,
        alignItems: 'center'
    },
    update_button_not_planted: {
        fontSize: 15,
        textAlign: 'center',
        borderRadius: 20,
        color: 'white'
    },
    update_button_planted: {
        fontSize: 15,
        textAlign: 'center',
        borderRadius: 20,
        zIndex: 20,
        position: 'absolute',
        alignSelf: 'center',
        color: 'rgb(126, 194, 144)',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    update_button_harvested: {

    },
    days: {
        bottom: 210,
        fontSize: 20,
        fontWeight: '200'
    },
    delete_container: {
        borderRadius: 20,
        width: 100,
        height: 30,
        zIndex: 20,
        justifyContent: 'center',
        backgroundColor: 'rgb(180, 180, 180)',
        bottom: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    delete_text: {
        color: 'white'
    }

})

export default styles