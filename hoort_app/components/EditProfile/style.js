import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        marginTop: 100,
        marginBottom: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        alignSelf: 'center'
    },
    title: {
        fontSize: 45,
        color: 'rgb(206, 175, 223)',
        fontWeight: '200'
    },
    description: {
        marginTop: 40,
        marginBottom: -10,
        color: 'grey',
        marginHorizontal: 70,
        textAlign: 'center',
        lineHeight: 20
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '400',
        color: 'lightgrey',
    },
    subtitle_container: {
        borderWidth: 4,
        borderColor: 'lightgrey',
        borderRadius: 20,
        marginTop: 80,
        marginBottom: 10,
        height: '4%',
        width: 250,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        height: 40,
        width: 250,
        fontSize: 25,
        borderStyle: "solid",
        borderColor: 'black',
        marginTop: 20,
        textAlign: 'center'
    },
    feedback: {
        position: 'absolute',
        top: '100%'
    }
})

export default styles