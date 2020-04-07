import { StyleSheet } from 'react-native'
import React, { Fragment, useState, useEffect } from 'react'

let height = 500
let width = 300

const styles = StyleSheet.create({
    main_container: {
        height: 1000
    },
    container: {
        marginTop: 30,
        flexDirection: 'row',
        borderWidth: 1.5,
        borderRadius: 15,
        borderColor: 'rgb(150, 150, 150)',
        width: width,
        height: height,
        alignSelf: 'center',
    },
    unit_min: {
        flex: 1,
        height: height / 5,
        width: width / 3,
        borderWidth: 1,
        borderColor: 'rgb(187, 154, 99)',
        borderStyle: 'dashed'
    },
    unit_pressed_min: {
        flex: 1,
        height: height / 5,
        width: width / 3,
        backgroundColor: 'rgb(187, 154, 99)',
        borderWidth: 0.5,
        borderColor: 'rgb(90, 90, 90)'
    },
    unit_medium: {
        flex: 1,
        height: height / 10,
        width: width / 6,
        borderWidth: 1,
        borderColor: 'rgb(187, 154, 99)',
        borderStyle: 'dashed'
    },
    unit_pressed_medium: {
        flex: 1,
        height: height / 10,
        width: width / 6,
        backgroundColor: 'rgb(187, 154, 99)',
        borderWidth: 0.5,
        borderColor: 'rgb(90, 90, 90)'
    },
    unit_max: {
        flex: 1,
        height: height / 20,
        width: width / 12,
        borderWidth: 1,
        borderColor: 'rgb(187, 154, 99)',
        borderStyle: 'dashed'
    },
    unit_pressed_max: {
        flex: 1,
        height: height / 20,
        width: width / 12,
        backgroundColor: 'rgb(187, 154, 99)',
        borderWidth: 0.5,
        borderColor: 'rgb(90, 90, 90)'
    },
    button_container: {
        alignSelf: 'center',
        position: 'absolute',
        width: 130,
        right: 0,
        bottom: 25,
        zIndex: 50
    },
    button_text: {
        color: 'white',
        fontSize: 40,
        zIndex: 50,
        fontWeight: '200'
    },

    divisions_container: {
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