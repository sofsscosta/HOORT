import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    main_container: {
        height: 120,
    },
    query_container: {
        padding: 40,
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        width: 250,
    },
    query_icon: {
        marginRight: 15,
        width: 50,
        height: 40,
    },
    query_line: {
        width: 250
    },
    query: {
        zIndex: 10,
        fontSize: 30,
        marginBottom: 0,
        paddingRight: 0
    },
    feedback: {
        paddingTop: '40%'
    }
})

export default styles