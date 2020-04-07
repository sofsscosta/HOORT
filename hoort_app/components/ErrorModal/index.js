import React, { Fragment } from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'
import styles from './style'

export default function ErrorModal(props) {

    return (
        <TouchableWithoutFeedback onPress={() => props.toggle()}>
            <View style={styles.background}>
                <View style={styles.container}>
                    <View style={styles.inside_container}>
                        <Text style={styles.title}>Uh oh! Something went wrong.</Text>
                        <Text style={styles[props.level]}>{props.message}</Text>
                        <Text style={styles.advice}>Click anywhere to try again.</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}