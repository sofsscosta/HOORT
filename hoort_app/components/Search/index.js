import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Button, TextInput, Image, ScrollView } from 'react-native'
import styles from './style'
import { searchItems } from '../../logic'
import { Results } from '../'
import Feedback from '../Feedback'

function Search({ isSuggestions, goToDetail }) {

    const [results, setResults] = useState()
    const [query, setQuery] = useState()
    const [error, setError] = useState(undefined)

    async function search(query) {

        try {
            setError(undefined)
            let result = await searchItems(query)
            if (result.length === 0) {
                throw new Error('There are no results for your search :(')
            }
            setResults(result)
        }
        catch (error) {
            console.log(error)
            return setError(error)
        }
    }

    return (
        <Fragment>
            <ScrollView style={styles.main_container}>
                <View style={styles.query_container}>
                    <Image
                        source={require('../../assets/query_icon.png')}
                        style={styles.query_icon}
                        resizeMode="contain" />
                    <View>
                        <TextInput
                            style={styles.query}
                            title='query'
                            placeholder='search here'
                            onSubmitEditing={async () => { return await search(query) }}
                            onChangeText={(query) => setQuery(query)}
                        />
                        <TouchableOpacity
                            onPress={async () => { return await search(query) }} >
                        </TouchableOpacity>
                        <Image
                            source={require('../../assets/query_line.png')}
                            style={styles.query_line}
                            resizeMode="contain" />
                    </View>
                </View>
                <Results results={results} goToDetail={goToDetail} _error={error ? error : ''} />
            </ScrollView>
        </Fragment >
    )
}

export default Search