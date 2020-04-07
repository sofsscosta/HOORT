import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { updateLandPlantVeggie, updateLandHarvestVeggie, retrieveLand, deleteVeggieFromLand, plantInLand } from '../../logic'
import styles from './style'
import modal_border from '../../assets/modal_border.png'
import button from '../../assets/divisions.png'


function Modal({ onBackgroundClick, type, veggie, land, unitPressed }) {

    const [currentType, setCurrentType] = useState(type)
    const [days, setDays] = useState()

    async function handlePlant() {
        try {
            await updateLandPlantVeggie(land.id, veggie.id)
            return setCurrentType('planted')
        }
        catch (error) {
            return console.log('error in modal handleplant ', error)
        }
    }

    async function handleHarvest() {
        try {
            await updateLandHarvestVeggie(land.id, veggie.id)
            return setCurrentType('harvested')
        }
        catch (error) {
            return console.log('error in modal handleharvest ', error)
        }
    }

    async function handleDelete() {
        try {
            land.scheme[unitPressed.item][unitPressed.unit.index] = true
            let _land = await plantInLand(land.id, land.scheme)

            for (let line of land.scheme) {
                if (line.includes(veggie.id.toString())) return onBackgroundClick()
            }

            await deleteVeggieFromLand(land.id, veggie.id)

            setCurrentType(undefined)
            return onBackgroundClick()
        }
        catch (error) {
            return console.log('error in modal handledelete ', error)
        }
    }

    if (currentType === 'planted')
        (async () => {

            let _land = await retrieveLand(land.id)
            let plantation = _land.plantation.find(plant => plant.veggie.toString() === veggie.id)

            let today = new Date()
            let minDate = plantation.estTime.split('-')[0].split('/')

            minDate[0].length === 1 ? minDate[0] = '0' + minDate[0] : ''
            minDate[1].length === 1 ? minDate[1] = '0' + minDate[1] : ''

            let newMinDate = minDate[2] + '-' + minDate[1] + '-' + minDate[0]
            let newMin = new Date(newMinDate)

            let _days = Math.floor((newMin - today) / (1000 * 60 * 60 * 24))

            return setDays(_days + 3) // to get the average day to harvest
        })()

    return (
        <TouchableWithoutFeedback
            onPress={onBackgroundClick}>
            <View style={styles.container} >
                <Text style={styles.title}>{veggie && veggie.name.toUpperCase()}</Text>
                <Image
                    source={button}
                    style={
                        currentType === 'notPlanted' && styles.button_notPlanted ||
                        currentType === 'planted' && styles.button_planted ||
                        currentType === 'harvested' && styles.button_harvest
                    }
                    resizeMode='stretch'
                ></Image>
                <Image
                    source={modal_border}
                    resizeMode='stretch'
                    style={styles.container_border} />
                <Text style={styles.state}>{
                    currentType === 'notPlanted' && 'NOT PLANTED' ||
                    currentType === 'planted' && 'PLANTED' ||
                    currentType === 'harvested' && 'HARVESTED'
                }</Text>
                <Text style={styles.days}>{currentType === 'planted' && days && `${days} DAYS TILL HARVEST`}</Text>
                <TouchableOpacity
                    style={
                        currentType === 'notPlanted' && styles.update_button_container ||
                        currentType === 'planted' && styles.update_button_container_planted
                    }
                    onPress={() => {
                        return currentType === 'notPlanted' && handlePlant() ||
                            currentType === 'planted' && handleHarvest()
                    }
                    }>
                    <Text style={
                        currentType === 'notPlanted' && styles.update_button_not_planted ||
                        currentType === 'planted' && styles.update_button_planted
                    }>{
                            currentType === 'notPlanted' && 'CLICK TO PLANT' ||
                            currentType === 'planted' && 'CLICK TO UPDATE TO HARVESTED'
                        }</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.delete_container}
                    onPress={() => handleDelete()}>
                    <Text style={styles.delete_text}>DELETE</Text>
                </TouchableOpacity>
                <View>
                </View>
            </View>
        </TouchableWithoutFeedback >
    );
};

export default Modal