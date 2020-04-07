import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    warning: {
        height: 40,
        width: 310,
        textAlign: 'center',
        alignSelf: 'center'
    },
    error: {
        color: 'rgb(255, 184, 184)',
        fontSize: 20,
        textAlign: 'center'
    },
    warning: {
        color: 'rgb(126, 194, 144)',
        fontSize: 20,
        textAlign: 'center',
    },
    title: {
        marginBottom: 50,
        fontSize: 30,
        fontWeight: '200',
        color: 'rgb(100, 100, 100)',
        textAlign: 'center'
    },
    advice: {
        marginTop: 20,
        color: 'rgb(100, 100, 100)',
    },
    background: {
        position: 'absolute',
        color: 'rgb(100,100,100)',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(400,400,400, 0.5)',
        zIndex: 200
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    inside_container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(400, 400, 400)',
        height: 300,
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 20,
        borderColor: 'rgb(200, 200, 200)'

    }

})

export default styles