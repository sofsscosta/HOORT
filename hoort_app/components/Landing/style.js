import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    landing: {
        width: 150,
        height: 300,
        bottom: '10%'
    },
    title: {
        color: 'rgb(150, 150, 150)',
        fontSize: 50,
        fontWeight: '200',
        bottom: '5%'
    }
})

export default styles