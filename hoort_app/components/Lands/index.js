import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Button, TextInput, Image, ScrollView, TouchableWithoutFeedback } from 'react-native'
import styles from './style'
import { LandsIcons, Feedback } from '../'
import { retrieveLand, retrieveUserLands } from '../../logic'
import newLand from '../../assets/my_lands.png'
import add from '../../assets/add.png'

function Lands({ goToLandDetail, goToCreateLand, lands, _error }) {


    const [error, setError] = useState(_error ? _error.message : '')

    useEffect(() => {
        (async () => {
            try {
                lands = await retrieveUserLands()
                if (lands.length === 0) {
                    _error = new Error('You have no lands yet!')
                    throw new Error('You have no lands yet!')
                }
            } catch (_error) {
                setError(_error.message)
            }
        })()
    }, [])

    async function handlegoToLandDetail(land) {
        try {
            let _land = await retrieveLand(land.id)
            return goToLandDetail(_land)
        }
        catch (error) {
            console.log(error)
            return setError(error.message)
        }
    }

    return (
        <>
            <TouchableWithoutFeedback onPress={() => setError(undefined)}>
                <ScrollView style={styles.container}>
                    <Text style={styles.title}>My Lands</Text>
                    <View>
                        <TouchableOpacity
                            onPress={() => { return goToCreateLand() }}>
                            <Image
                                source={newLand}
                                style={styles.button}
                                resizeMode='contain'
                            ></Image>
                            <View style={styles.button_container}>
                                <Text
                                    style={styles.button_text}
                                >NEW LAND</Text>
                                <Image
                                    source={add}
                                    style={styles.add}
                                    resizeMode='contain'
                                ></Image>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {error &&
                        <Feedback level='warning' message={error} />
                        ||
                        <FlatList
                            style={styles.myVeggies_container}
                            data={lands}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <LandsIcons land={item} key={item.id} goToLandDetails={() => handlegoToLandDetail(item)} />
                            )} />
                    }
                </ScrollView>
            </TouchableWithoutFeedback>
        </>
    )
}

export default Lands