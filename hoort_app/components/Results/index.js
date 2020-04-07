import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Button, TextInput, Image, ScrollView, SafeAreaView } from 'react-native'
import styles from './style'
import { Item, Feedback } from '../'

function Results({ results, goToDetail, resultsType, _error }) {

    const [error, setError] = useState(_error ? _error.message : '')

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let monthNum = new Date().getMonth()
    let month = months[monthNum]

    useEffect(() => {
        setError(_error)
    }, [_error])

    return (
        <Fragment>
            {resultsType === 'myVeggies' && <Text style={styles.title}>My Veggies</Text>}
            {resultsType === 'suggested' && <Text style={styles.month_title}>{`What to plant in ${month}`}</Text>}

            {error &&
                <View style={resultsType === 'myVeggies' ? styles.feedback_veggies : styles.feedback}>
                    <Feedback level='warning' message={_error ? _error.message : ''} />
                </View>
                || results &&
                < FlatList
                    style={resultsType && styles.myVeggies_container || styles.results_container}
                    data={results}
                    keyExtractor={item => item._id ? item._id.toString() : item.id}
                    renderItem={({ item }) => (
                        <Item item={item} key={item._id ? item._id.toString() : item.id} goToDetail={goToDetail} />
                    )} />
            }
        </Fragment >
    )
}

export default Results