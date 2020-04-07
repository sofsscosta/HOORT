import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Button, TextInput, Image, ScrollView } from 'react-native'
import styles from './style'
import results_background from '../../assets/result_item.png'
import { retrieveItem } from '../../logic'

function Item({ item, goToDetail, forPlantNow }) {

    const images = {
        tomatoes: require('../../assets/tomatoes.png'),
        potatoes: require('../../assets/potatoes.png'),
        carrots: require('../../assets/carrots.png'),
        strawberries: require('../../assets/strawberries.png'),
        spinach: require('../../assets/spinach.png')
    }

    async function onClick(id) {
        try {
            if (forPlantNow !== undefined) return forPlantNow()
            let _item = await retrieveItem(id)
            return goToDetail(_item)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <TouchableOpacity
            key={item.id}
            title={item.name}
            onPress={async () => {
                return await onClick(item._id ? item._id.toString() : item.id)
            }}>
            <Image
                style={styles.background}
                source={results_background}
                resizeMode='contain'
            />
            <View
                style={styles.container_items}>
                <Image
                    style={styles.image}
                    source={images[`${item.name}`]}
                    resizeMode='contain'
                />
                <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={styles.title}>{item.name.toUpperCase()}</Text>
            </View>
        </TouchableOpacity >
    )
}

export default Item