import React, { Fragment } from 'react'
import { Text, View } from 'react-native'
import styles from './style'

export default function Feedback(props) {

    return <Text style={styles[props.level]}>{props.message}</Text>

}