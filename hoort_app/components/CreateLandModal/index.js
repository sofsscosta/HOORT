import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { retrieveItem } from '../../logic'
import styles from './style'
import modal_border from '../../assets/modal_border.png'
import button from '../../assets/divisions.png'

function CreateLandModal({ onBackgroundClick, goToCreateLand }) {

    const [name, setName] = useState()
    const [soiltype, setSoiltype] = useState()
    const [location, setLocation] = useState()

    return (
        <TouchableWithoutFeedback onPress={() => onBackgroundClick()}>
            <View style={styles.container} >
                <Text style={styles.title}>NEW LAND</Text>
                <TextInput
                    onChangeText={(name) => setName(name)}
                    style={styles.input}
                    placeholder="Your land's name...">
                </TextInput>
                <TextInput
                    onChangeText={(soilType) => setSoiltype(soilType)}
                    style={styles.input}
                    placeholder="What's its soil type?">
                </TextInput>
                <TextInput
                    onChangeText={(location) => setLocation(location)}
                    style={styles.input}
                    placeholder="Define a location">
                </TextInput>
                <TouchableOpacity
                    style={styles.button_container}
                    onPress={() => goToCreateLand({ name, location, soiltype })}>
                    <Image
                        style={styles.button}
                        source={button}
                        resizeMode='stretch'
                    ></Image>
                    <Text style={styles.create}>CREATE!</Text>
                </TouchableOpacity>
                <View>
                    <Image
                        source={modal_border}
                        resizeMode='stretch'
                        style={styles.container_border} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default CreateLandModal