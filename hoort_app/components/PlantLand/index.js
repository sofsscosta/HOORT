import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Image, ScrollView, TouchableWithoutFeedback } from 'react-native'
import styles from './style'
import { retrieveAll, plantInLand, isLoggedIn, updateLandAddVeggie, retrieveItem, retrieveLand } from '../../logic'
import plant_now from '../../assets/plant_now.png'
import change_veggie from '../../assets/change_veggie.png'
import land_with_text from '../../assets/land-with-text.png'

function PlantLand({ land, onClickVeggie, updatedLand, submit, goToPlantNow, selectedVeg }) {

    const [currentLand, setCurrentLand] = useState(land)
    const [scheme, setScheme] = useState(land.scheme)
    const [menu, setMenu] = useState(false)
    const [veggies, setVeggies] = useState()
    const [veggie, setVeggie] = useState()
    const [pressed, setPressed] = useState(false)
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
                let isLogged = await isLoggedIn()
                if (!isLogged) return setError('Your session expired! Please login again.')
            } catch (error) {
                console.log('error in plantland = ', error)
                return setError(error.message)
            }
        })()
    }, [])

    useEffect(() => {
        setVeggie(selectedVeg)
    }, [selectedVeg])

    useEffect(() => {
        (async function retrieveVeggies() {
            try {
                let veggies = await retrieveAll()
                setVeggies(veggies)

                let _land = await retrieveLand(land.id)

                return setCurrentLand(_land)

            } catch (error) {
                return console.log('first error = ' + error)
            }
        })()
    }, [updatedLand])


    useEffect(() => {
        (async () => {
            let updatedLand
            let _scheme = currentLand.scheme

            try {
                _scheme[unitPressed.item][unitPressed.unit.index] = veggie.item.id
                updatedLand = await plantInLand(land.id, _scheme)
                await updateLandAddVeggie(land.id, veggie.item.id)
                return setCurrentLand(updatedLand)
            } catch (error) {
                return console.log('error = ' + error)
            }
        })()
    }, [unitPressed])


    function handleUnitPressed(itemIndexInScheme, unit) {
        return setUnitPressed({ item: itemIndexInScheme, unit })
    }


    function handleStyleUnit(unitValue) {

        if (land.scheme.length === 5) {
            return !unitValue ? styles.unit_min : styles.unit_pressed_min
        }
        else if (land.scheme.length === 10) {
            return !unitValue ? styles.unit_medium : styles.unit_pressed_medium
        }
        else if (land.scheme.length === 20) {
            return !unitValue ? styles.unit_max : styles.unit_pressed_max
        }
    }


    function handleStyleUnitImage(unitValue) {

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


    async function handlePlantMenu() {
        return !menu ? setMenu(true) : setMenu(false)
    }


    function handlePressed() {
        return !pressed ? setPressed(true) : setPressed(false)
    }


    function handleSelectItem(veggie) {
        handlePlantMenu()
        return setVeggie(veggie)
    }


    async function handleOnClickVeggie(_veggie, item, unit) {

        try {
            let _type

            let plantations = currentLand.plantation
            let plantation = plantations.find(plant => plant.veggie.toString() === _veggie)

            if (!plantation || !plantation.from && !plantation.to) _type = 'notPlanted'
            else if (plantation.from && !plantation.to) _type = 'planted'
            else if (plantation.from && plantation.to) _type = 'harvested'
            else if (!plantation.from && plantation.to) throw new Error('something went wrong!')

            const veg = await retrieveItem(_veggie)
            await onClickVeggie(veg, currentLand, _type, { item, unit })
            return

        } catch (error) {
            return console.log(error)
        }
    }

    function handleOnPressOptions(unit, item) {
        if (unit.item && pressed) {
            if (typeof currentLand.scheme[scheme.indexOf(item)][unit.index] === 'boolean' && veggie !== undefined) {
                return handleUnitPressed(scheme.indexOf(item), unit)
            }
        }
        else if (unit.item && typeof currentLand.scheme[scheme.indexOf(item)][unit.index] !== 'boolean') {
            return handleOnClickVeggie(currentLand.scheme[scheme.indexOf(item)][unit.index], scheme.indexOf(item), unit)
        }
    }

    return (
        <Fragment>
            <TouchableWithoutFeedback
                onPress={() => { return menu ? handlePlantMenu() : '' }}>
                <ScrollView
                    style={styles.main_container}
                    scrollEnabled={false}>
                    <View
                        onPress={() => { return menu ? handlePlantMenu() : '' }}>
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
                                                <TouchableOpacity style={handleStyleUnit(unit.item)}
                                                    onPress={() => handleOnPressOptions(unit, item)}>
                                                    {typeof currentLand.scheme[scheme.indexOf(item)][unit.index] !== 'boolean'
                                                        && <Image
                                                            source={images[
                                                                `${veggies && veggies.find(_veggie => _veggie.id === currentLand.scheme[scheme.indexOf(item)][unit.index]).name}`
                                                            ]}
                                                            style={handleStyleUnitImage(unit.item)}
                                                            resizeMode='contain'></Image>}
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                )
                            }} />
                        <View style={styles.buttons_container}>
                            <View>
                                <TouchableOpacity
                                    onPress={() => {
                                        pressed ? handlePressed() : ''
                                        return handlePlantMenu()
                                    }}>
                                    <Image
                                        style={styles.button}
                                        resizeMode='contain'
                                        source={change_veggie}
                                    ></Image>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => goToPlantNow(currentLand)}>
                                    <Image
                                        style={styles.button}
                                        resizeMode='contain'
                                        source={plant_now}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.menu_icon_container}>
                                <View
                                    style={menu ? styles.menu_container : styles.menu_container_hidden}>

                                    <Image
                                        source={styles.land_border}
                                        style={styles.menu_border} />
                                    <FlatList
                                        style={styles.menu}
                                        data={veggies}
                                        keyExtractor={item => item.id}
                                        renderItem={({ item }) => {
                                            return (
                                                <TouchableOpacity
                                                    onPress={() => handleSelectItem({ item })}
                                                    style={styles.menu_veggie}>
                                                    <Image
                                                        style={styles.menu_image}
                                                        resizeMode='contain'
                                                        source={images[`${item.name}`]}></Image>
                                                    <Text style={styles.menu_item_name}>{item.name.toUpperCase()}</Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    ></FlatList>
                                </View>

                                <TouchableOpacity
                                    style={!pressed ? '' : styles.button_plant_border}
                                    onPress={() => {
                                        if (!veggie) {
                                            return handlePlantMenu()
                                        }
                                        else return handlePressed()
                                    }}>
                                    <Image
                                        style={!pressed ? styles.button_plant : styles.button_plant_pressed}
                                        resizeMode='contain'
                                        source={!veggie ? land_with_text : images[`${veggie.item.name}`]}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
            <TouchableOpacity
                style={styles.submit}
                onPress={() => {
                    return submit(currentLand)
                }}>
                <Text style={styles.submit_text}>DONE</Text>
            </TouchableOpacity>
        </Fragment >
    )
}

export default PlantLand