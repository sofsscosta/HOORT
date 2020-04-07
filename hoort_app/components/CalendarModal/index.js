import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { retrieveLand } from '../../logic'
import styles from './style'
import LandsIcons from '../LandsIcons'

function CalendarModal({ onBackgroundClick, modalInfo, goToLandDetails }) {

    const [error, setError] = useState()
    const [lands, setLands] = useState()

    useEffect(() => {
        (async () => {
            try {
                let _lands = await Promise.all(modalInfo.lands.map(async _land => {
                    if (_land !== undefined && _land.length !== 0) {

                        let land = await retrieveLand(_land)

                        return land
                    }
                }))

                let filteredLands = _lands.filter(land => { return land !== undefined })

                setLands(filteredLands)
            }
            catch (error) {
                console.log(error)
            }
        })()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={() => onBackgroundClick()}>
            <View style={styles.container} >
                <Text style={styles.title}>{`YOUR ${modalInfo.name.toUpperCase()} IN ${modalInfo.month.toUpperCase()}`}</Text>
                <Text style={styles.description}>SCROLL OR CLICK ON LAND</Text>
                <View style={styles.lands_container}>
                    <ScrollView style={{ height: 450, width: 350 }}>
                        <FlatList
                            resizeMode='stretch'
                            data={lands}
                            style={styles.icons}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => {

                                return <LandsIcons goToLandDetails={() => goToLandDetails(item)} land={item} />
                            }}>

                        </FlatList>
                    </ScrollView>
                </View>
                <View>
                    <View
                        resizeMode='stretch'
                        style={styles.container_border} />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default CalendarModal