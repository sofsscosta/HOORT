import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { searchSuggested } from '../../logic'
import { Feedback, Item } from '../'
import styles from './style'
import modal_border from '../../assets/modal_border.png'

function PlantNowModal({ onBackgroundClick, land }) {

    const [error, setError] = useState()
    const [suggested, setSuggested] = useState()

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let monthNum = new Date().getMonth()
    let month = months[monthNum]

    useEffect(() => {
        (async () => {
            let suggestedVeggies
            try {
                setError(undefined)
                suggestedVeggies = await searchSuggested()
                return setSuggested(suggestedVeggies)
            } catch (error) {
                return setError(error)
            }
        })()
    }, [])

    return (
        <TouchableWithoutFeedback onPress={() => onBackgroundClick(land)}>
            <View style={styles.container} >
                <View style={styles.inside_container}>
                    <Text style={styles.title}>{`WHAT TO PLANT IN ${month.toUpperCase()}`}</Text>
                    <View>
                        <Image
                            source={modal_border}
                            resizeMode='stretch'
                            style={styles.container_border} />
                    </View>
                    {error &&
                        <ScrollView>
                            <View style={styles.feedback}>
                                <Feedback level='warning' message={error.message} />
                            </View>
                        </ScrollView>
                        || suggested &&
                        < FlatList
                            style={styles.results_container}
                            data={suggested}
                            keyExtractor={item => item._id ? item._id.toString() : item.id}
                            renderItem={({ item }) => (
                                <Item item={item} key={item._id ? item._id.toString() : item.id} />
                            )} />
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default PlantNowModal