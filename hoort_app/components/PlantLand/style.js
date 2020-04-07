import { StyleSheet } from 'react-native'

let height = 460
let width = 276

const styles = StyleSheet.create({
    main_container: {
        height: 1000,
        alignSelf: 'center',
        overflow: 'visible'
    },
    container: {
        marginTop: 20,
        flexDirection: 'row',
        alignSelf: 'center',
        width: width,
        height: height,
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
        backgroundColor: 'rgb(255, 243, 223)',
        borderWidth: 1,
        borderColor: 'rgb(187, 154, 99)',
        borderStyle: 'dashed'
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
        backgroundColor: 'rgb(255, 243, 223)',
        borderWidth: 1,
        borderColor: 'rgb(187, 154, 99)',
        borderStyle: 'dashed'
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
        backgroundColor: 'rgb(255, 243, 223)',
        borderWidth: 1,
        borderColor: 'rgb(187, 154, 99)',
        borderStyle: 'dashed'
    },
    unit_image_min: {
        height: height / 5,
        width: width / 3,
    },
    unit_image_medium: {
        height: height / 10,
        width: width / 6,
    },
    unit_image_max: {
        height: height / 20,
        width: width / 12,
    },
    buttons_container: {
        flexDirection: 'row'
    },
    button: {
        width: 250,
        height: 55,
        marginTop: 15,
    },
    button_plant: {
        marginTop: 15,
        width: 120,
        height: 120,
        marginLeft: 15
    },
    button_plant_pressed: {
        width: 100,
        height: 100,
        opacity: 0.5,
        alignSelf: 'center',
        top: 5
    },
    button_plant_border: {
        marginTop: 15,
        width: 120,
        height: 120,
        borderWidth: 4,
        borderRadius: 20,
        borderColor: 'rgb(126, 194, 144)',
        marginLeft: 15
    },
    menu: {
    },
    menu_icon_container: {
        flexDirection: 'column',
    },
    menu_container: {
        position: 'absolute',
        bottom: 100,
        backgroundColor: 'white',
        padding: 20,
        height: 300,
        width: 250,
        right: 10,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: 'rgb(171, 126, 195)',
    },
    menu_container_hidden: {
        display: 'none',
    },
    menu_veggie: {
        marginTop: 10,
        flexDirection: 'row',
        overflow: 'visible',
        alignItems: 'center'
    },
    menu_image: {
        height: 50,
        width: 50,
        zIndex: 20,
        marginRight: 20
    },
    menu_item_name: {
        fontSize: 20
    },
    submit: {
        alignSelf: 'center',
        position: 'absolute',
        width: 130,
        right: 0,
        bottom: 25,
        zIndex: 50
    },
    submit_text: {
        color: 'white',
        fontSize: 40,
        zIndex: 50,
        fontWeight: '200'
    }
})

export default styles