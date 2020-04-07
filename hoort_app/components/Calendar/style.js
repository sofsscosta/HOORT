import { StyleSheet } from 'react-native'

export default StyleSheet.create({
    message_container: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginHorizontal: 20,
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100

    },
    message: {
        fontSize: 20,
        fontWeight: '200',
        alignSelf: 'center'

    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        color: 'grey',
        paddingTop: '8%',
        marginHorizontal: '5%',
        fontWeight: '200',
        alignSelf: 'center'
    }
})