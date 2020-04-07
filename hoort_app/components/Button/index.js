import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import styles from './style'

export default function Button(props) {

    return (
        <TouchableOpacity style={styles[props.type]} onPress={props.onPress}>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}
