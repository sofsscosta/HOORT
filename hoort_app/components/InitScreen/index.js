import React, { Fragment } from 'react';
import { View, Image, Button, TouchableOpacity } from 'react-native';
import styles from './style'

const InitScreen = ({ start }) => {

    return (
        <Fragment>
            <TouchableOpacity title='start' style={styles.container} onPress={ev => {
                ev.preventDefault()
                start()
            }} >
                <Image
                    style={styles.icon}
                    source={require('../../assets/icon.png')}
                    resizeMode="contain">
                </Image>
                <Image
                    style={styles.logo}
                    source={require('../../assets/logo.png')}
                    resizeMode="contain">
                </Image>
            </ TouchableOpacity>
        </Fragment>
    );
};

export default InitScreen
