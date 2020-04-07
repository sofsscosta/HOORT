import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
    container: {
        padding: 40,
        flex: 1,
        flexDirection: 'row',
        width: 250,
    },
    container_items: {
        padding: '3%',
        paddingLeft: '12%',
        flex: 1,
        flexDirection: 'row',
        width: 250,
        height: 10,
        bottom: 110,
        alignContent: 'center',
    },
    query: {
        zIndex: 10,
        fontSize: 30,
        marginBottom: 0,
        paddingRight: 0
    },
    results_container: {
        top: 200,
        flex: 1
    },
    image: {
        height: 70,
        width: 70,
        marginTop: '7%'
    },
    background: {
        width: '90%',
        height: 100,
        alignSelf: 'center',
    },
    title: {
        fontSize: 30,
        top: '23%',
        height: '250%',
        width: '100%',
        marginLeft: '10%',
        alignSelf: 'center',
        color: 'white',
        fontWeight: '200'
    }

})

export default styles