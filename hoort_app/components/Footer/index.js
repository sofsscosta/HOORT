import React, { Fragment } from 'react';
import { View, StatusBar, Image } from 'react-native';
import styles from './style'

const Footer = () => {

    return (
        <Fragment>
            <Image
                style={styles.footer}
                source={require('../../assets/footer.png')}
                resizeMode="stretch" />
        </Fragment>
    )
}

export default Footer