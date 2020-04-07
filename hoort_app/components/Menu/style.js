import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container__all: {
        paddingTop: 50,
        flex: 1,
        position: 'absolute',
        top: 165,
        width: 250,
        backgroundColor: 'rgb(221, 254, 231)',
        zIndex: 10,
        borderBottomRightRadius: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        position: 'relative',
    },
    header: {
        flex: 1.5,
        alignSelf: 'center',
    },
    options: {
        flex: 1,
        alignSelf: 'center',
        color: 'rgb(147, 147, 147)',
        height: 70,
        fontSize: 25,
        fontWeight: '200'
    },
    optionsLight: {
        backgroundColor: 'rgb(239, 255, 244)',
        alignSelf: 'center',
        color: 'rgb(147, 147, 147)',
        height: 70,
        fontSize: 20
    }
})

export default styles