import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: 300,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    divisions: {
        flex: 1,
        marginTop: 20,
        width: 300,
    },
    less: {
        alignSelf: 'center',
        height: 30,
        width: 30,
        left: 45,
        zIndex: 5,
    },
    more: {
        height: 30,
        width: 30,
        right: 45,
    }
})

export default styles 