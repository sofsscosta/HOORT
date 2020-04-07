import { StyleSheet } from 'react-native'

let height = 250
let width = 150

const styles = StyleSheet.create({
    main_container: {
        top: 100,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 450,
    },
    title: {
        fontSize: 50,
        paddingTop: 40,
        alignSelf: 'center',
        color: 'rgb(147, 147, 147)'
    },
    land_border: {
        height: 350,
        width: 250
    },
    name: {
        bottom: 210,
        zIndex: 40,
        fontSize: 30,
        color: 'rgb(100, 100, 100)'
    },
    container: {
        bottom: 295,
        flexDirection: 'row',
        borderRadius: 10,
        width: width,
        height: height,
        borderWidth: 5,
        borderColor: 'rgb(180, 180, 180)',
        alignSelf: 'center',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    unit_min: {
        flex: 1,
        height: height / 5,
        width: width / 3,
    },
    unit_pressed_min: {
        flex: 1,
        height: height / 5,
        width: width / 3,
        backgroundColor: 'rgb(187, 154, 99)',

    },
    unit_medium: {
        flex: 1,
        height: height / 10,
        width: width / 6,
    },
    unit_pressed_medium: {
        flex: 1,
        height: height / 10,
        width: width / 6,
        backgroundColor: 'rgb(187, 154, 99)',
    },
    unit_max: {
        flex: 1,
        height: height / 20,
        width: width / 12,
    },
    unit_pressed_max: {
        flex: 1,
        height: height / 20,
        width: width / 12,
        backgroundColor: 'rgb(187, 154, 99)',
    }
})

export default styles