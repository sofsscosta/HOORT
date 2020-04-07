import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, TouchableWithoutFeedback, Text, View } from 'react-native'
import styles from './style'
import { isLoggedIn, logout, retrieveUserVeggies, searchSuggested, retrieveUserLands } from '../../logic'

function Menu({ goToMyLands, goToMyVeggies, goToCalendar, goToEditProfile, goToSearch, goToSuggestions, goToTutorial, goToLanding, menu }) {

    let notLoggedMenu, loggedMenu

    const [data, setData] = useState(notLoggedMenu)
    const [error, setError] = useState(undefined)

    useEffect(() => {
        (async () => {
            try {
                setError(undefined)
                let _token = await isLoggedIn()
                if (_token) {
                    setData(loggedMenu)
                } else setData(notLoggedMenu)
            } catch (error) {
                setError(error)
            }
        })()
    }, [])

    notLoggedMenu = [
        {
            id: 1, title: 'SEARCH', action: () => {
                setError(undefined)
                goToSearch()
                return menu()
            }
        },
        {
            id: 2, title: 'WHAT TO PLANT', action: async () => {
                let suggestedVeggies

                try {
                    setError(undefined)
                    suggestedVeggies = await searchSuggested()
                    goToSuggestions(suggestedVeggies)
                    return menu()
                } catch (error) {
                    return console.log(error)
                }
            }
        },
        { id: 3, title: 'TUTORIAL', action: () => { setError(undefined); goToTutorial(); return menu() } }
    ]

    loggedMenu = [
        {
            id: 1, title: 'MY LANDS', action: async () => {
                let _error
                let lands
                try {
                    setError(undefined)
                    goToMyLands(lands)
                    return menu()
                } catch (error) {
                    setError(error)
                    return goToMyLands(lands, _error)
                }
            }
        },
        {
            id: 2, title: 'MY VEGGIES', action: async () => {

                let userVeggies

                try {
                    setError(undefined)
                    userVeggies = await retrieveUserVeggies()
                    if (userVeggies.length === 0) {
                        throw new Error('You have no veggies in your lands yet!')
                    }
                    goToMyVeggies(userVeggies, error)
                    return menu()
                } catch (error) {
                    setError(error.message)
                    return goToMyVeggies(userVeggies, error)
                }
            }
        },
        {
            id: 3, title: 'WHAT TO PLANT', action: async () => {

                let suggestedVeggies
                try {
                    setError(undefined)
                    suggestedVeggies = await searchSuggested()
                    goToSuggestions(suggestedVeggies)
                    return menu()
                } catch (error) {
                    return console.log(error)
                }
            }
        },
        { id: 4, title: 'CALENDAR', action: () => { setError(undefined); goToCalendar(); return menu() } },
        {
            id: 5, title: 'SEARCH', action: () => {
                setError(undefined)
                goToSearch()
                return menu()
            }
        },
        { id: 6, title: 'EDIT PROFILE', action: () => { setError(undefined); return goToEditProfile() } },
        {
            id: 7, title: 'LOGOUT', action: async () => {
                setError(undefined)
                await logout()
                goToLanding()
                return menu()
            }
        }
    ]

    return (
        < Fragment >
            <TouchableOpacity style={{ height: '100%', width: '100%', position: 'absolute', zIndex: 20, backgroundColor: 'rgba(100, 100, 100, 0.2)' }} onPress={() => menu()}>
                <FlatList
                    style={styles.container__all}
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.container}
                            key={item.id}
                            title={item.title}
                            onPress={() => item.action()}>
                            <View>
                                <Text style={styles.options}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </TouchableOpacity>
        </Fragment >
    )
}

export default Menu