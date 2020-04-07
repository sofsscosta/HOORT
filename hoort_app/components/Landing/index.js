import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, StatusBar, Button, Image, TouchableOpacity } from 'react-native';
import styles from './style'
import { retrieveUserLands, isLoggedIn, retrieveUser } from '../../logic'

const Landing = ({ goToRegister, goToMyLands, fromMenu }) => {

    const [isLogged, setIsLogged] = useState()

    useEffect(() => {
        (async () => {
            try {
                setIsLogged(false)
                let _token = await isLoggedIn()
                if (_token) {
                    let user = await retrieveUser()
                    return setIsLogged(true)
                }
                else return setIsLogged(false)
            } catch (error) {
                console.log(error)
                return setIsLogged(false)
            }
        })()
    }, [, fromMenu])

    async function handlePressLand() {
        if (isLogged) {
            let lands
            try {
                lands = await retrieveUserLands()
                goToMyLands(lands)
                return menu()
            } catch (error) {
                return console.log(error)
            }
        }
        else return goToRegister()
    }

    return (
        <Fragment>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => handlePressLand()}>
                    <Image
                        style={styles.landing}
                        source={require('../../assets/landing.png')}
                        resizeMode="contain"></Image>
                </TouchableOpacity>
                <Text style={styles.title}>LET'S PLANT?</Text>
            </View>
        </Fragment>
    );
};

export default Landing
