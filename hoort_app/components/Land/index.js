import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Image, ScrollView } from 'react-native'
import styles from './style'
import { retrieveAll, plantInLand, updateLandAddVeggie, retrieveLand, deleteLand, retrieveUserLands } from '../../logic'
import plant_now from '../../assets/plant_now.png'
import change_veggie from '../../assets/change_veggie.png'
import land_with_text from '../../assets/land-with-text.png'
import land_border from '../../assets/land_border.png'

function Land({ landFromMyLands, landFromPlantLand, goToPlantLand, submit }) {


    const [currentLand, setCurrentLand] = useState(landFromPlantLand ? landFromPlantLand : landFromMyLands)
    const [scheme, setScheme] = useState(currentLand.scheme)
    const [veggies, setVeggies] = useState()
    const [veggie, setVeggie] = useState(undefined)
    const [unitPressed, setUnitPressed] = useState(undefined)

    const images = {
        tomatoes: require('../../assets/tomatoes.png'),
        potatoes: require('../../assets/potatoes.png'),
        carrots: require('../../assets/carrots.png'),
        strawberries: require('../../assets/strawberries.png'),
        spinach: require('../../assets/spinach.png')
    }

    useEffect(() => {
        (async () => {
            try {

                let veggies = await retrieveAll()
                setVeggies(veggies)

                let _land = await retrieveLand(currentLand.id)

                return setCurrentLand(_land)

            } catch (error) {
                return console.log('first error = ' + error)
            }
        })()
    }, [])

    useEffect(() => {
        (async () => {
            let updatedLand
            let _scheme = currentLand.scheme

            try {
                _scheme[unitPressed.item][unitPressed.unit.index] = veggie.item.id
                updatedLand = await plantInLand(currentLand.id, _scheme)
                await updateLandAddVeggie(currentLand.id, veggie.item.id)
                return setCurrentLand(updatedLand)
            } catch (error) {
                return console.log('error = ' + error)
            }
        })()
    }, [unitPressed])


    function handleStyleUnit(unitValue) {

        if (currentLand.scheme.length === 5) {
            return !unitValue ? styles.unit_min : styles.unit_pressed_min
        }
        else if (currentLand.scheme.length === 10) {
            return !unitValue ? styles.unit_medium : styles.unit_pressed_medium
        }
        else if (currentLand.scheme.length === 20) {
            return !unitValue ? styles.unit_max : styles.unit_pressed_max
        }
    }

    function handleStyleUnitImage() {

        if (currentLand.scheme.length === 5) {
            return styles.unit_image_min
        }
        else if (currentLand.scheme.length === 10) {
            return styles.unit_image_medium
        }
        else if (currentLand.scheme.length === 20) {
            return styles.unit_image_max
        }
    }

    async function handleDeleteLand() {
        await deleteLand(currentLand.id)
        return handleOnSubmit()
    }

    async function handleOnSubmit() {

        let lands
        try {
            lands = await retrieveUserLands()
            return submit(lands)
        } catch (error) {
            return console.log(error)
        }
    }

    return (
        <Fragment>
            <ScrollView
                style={styles.main_container}
                scrollEnabled={false}>
                <View>
                    <FlatList
                        scrollEnabled={false}
                        style={styles.container}
                        data={scheme}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => {
                            return (
                                <FlatList
                                    scrollEnabled={false}
                                    horizontal={true}
                                    data={item}
                                    keyExtractor={unit => unit.id}
                                    renderItem={(unit) => {
                                        return (
                                            <View style={handleStyleUnit(unit.item)}>
                                                {typeof currentLand.scheme[scheme.indexOf(item)][unit.index] !== 'boolean'
                                                    && <View>
                                                        <Image
                                                            source={images[
                                                                `${veggies && veggies.find(_veggie => _veggie.id === currentLand.scheme[scheme.indexOf(item)][unit.index]).name}`
                                                            ]}
                                                            style={handleStyleUnitImage(unit.item)}
                                                            resizeMode='contain'></Image>
                                                    </View>
                                                }
                                            </View>
                                        )
                                    }}
                                />
                            )
                        }} />
                    <Text style={styles.name}>{currentLand.name.toUpperCase()}</Text>
                    <TouchableOpacity style={styles.edit_container} onPress={() => goToPlantLand(currentLand)}>
                        <Text style={styles.edit}>CLICK HERE TO EDIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.delete_container} onPress={() => handleDeleteLand()}>
                        <Text style={styles.delete}>DELETE LAND</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.submit}
                onPress={() => handleOnSubmit()}>
                <Text style={styles.submit_text}>DONE</Text>
            </TouchableOpacity>
        </Fragment >
    )
}

export default Land