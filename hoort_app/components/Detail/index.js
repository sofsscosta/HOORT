import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, TouchableOpacity, Text, View, Button, TextInput, Image, ScrollView } from 'react-native'
import styles from './style'
import { isLoggedIn, retrieveItemForUser, retrieveLand } from '../../logic'
import Feedback from '../Feedback'
import LandsIcons from '../LandsIcons'

function Detail({ item, goToLandDetail }) {

    const [userInfo, setUserInfo] = useState(undefined)
    const [lands, setLands] = useState()

    useEffect(() => {
        (async () => {
            let isLogged = await isLoggedIn()
            if (isLogged) {
                try {
                    let userItemDetail = await retrieveItemForUser(item.id)
                    setUserInfo(userItemDetail)
                    return
                }
                catch (error) {
                    return console.log(error)
                }
            }
        })()
    }, [])

    useEffect(() => {

        userInfo && (async () => {

            try {
                const result = await Promise.all(userInfo[0][1].map(async land => {

                    let retrievedLand = await retrieveLand(land)
                    return retrievedLand
                }))

                setLands(result)
            }
            catch (error) {
                console.log(error)
            }
        })()

    }, [userInfo])

    const images = {
        tomatoes: require('../../assets/tomatoes.png'),
        potatoes: require('../../assets/potatoes.png'),
        carrots: require('../../assets/carrots.png'),
        strawberries: require('../../assets/strawberries.png'),
        spinach: require('../../assets/spinach.png')
    }

    let bestPeriod = []

    item.bestPeriod.split(' ').map(_month => {
        let month = ''
        for (let i = 0; i < _month.length; i++) {
            if (i === 0) {
                month += _month[i].toUpperCase()
            }
            else month += _month[i]
        }
        bestPeriod.push(month)
    })

    bestPeriod = bestPeriod.join(' ')


    async function goToLandDetails(land) {
        try {
            let _land = await retrieveLand(land.id)
            return goToLandDetail(_land)
        }
        catch (error) {
            return console.log(error)
        }
    }

    return (
        <Fragment>
            <View style={styles.title_container}>
                <Text style={styles.title}>{item.name.toUpperCase()}</Text>
            </View>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={images[`${item.name}`]}
                        resizeMode='contain'
                    />
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Type  </Text><Text style={styles.description}>{item.subtype}</Text>
                    </View>
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Growth  </Text><Text style={styles.description}>{item.growth}</Text>
                    </View>
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Growth duration (from seed)  </Text><Text style={styles.description}>{`${item.growthDuration} days`}</Text>
                    </View>
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Best type of soil  </Text><Text style={styles.description}>{item.soil}</Text>
                    </View>
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Ideal growth temperature  </Text><Text style={styles.description}>{`${item.temperature}ºC`}</Text>
                    </View>
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Light preference  </Text><Text style={styles.description}>{item.lightPreference}</Text>
                    </View>
                    <View
                        style={styles.inline}>
                        <Text style={styles.subtitles}>Best months to plant  </Text><Text style={styles.description}>{`${bestPeriod}`}</Text>
                    </View>
                    {userInfo &&
                        <Fragment>
                            <View
                                style={styles.inline}>
                                <Text style={styles.subtitles_special}>Growth time from our users  </Text><Text style={styles.description}>{`${userInfo[1][1]} days`}</Text>
                            </View>
                            {userInfo[2] && <View
                                style={styles.inline}>
                                <Text style={styles.subtitles_special}>My average growth time  </Text><Text style={styles.description}>{`${userInfo[2][1]} days`}</Text>
                            </View>}
                            <View style={styles.userVeggie}>
                                <Text style={styles.subtitles_user_lands}>{`My ${item.name}  `}</Text>
                                <View>
                                    <Text style={styles.userVeggie_description} />
                                    <View>
                                        {
                                            userInfo[0][1].length === 0
                                                ? <Feedback level='warning' message={`You haven\'t planted ${item.name} in your lands yet!`} />
                                                : <FlatList
                                                    data={lands}
                                                    style={styles.icons}
                                                    keyExtractor={item => item.id}
                                                    renderItem={({ item }) => {

                                                        return <LandsIcons goToLandDetails={() => goToLandDetails(item)} land={item} />
                                                    }}>

                                                </FlatList>
                                        }
                                    </View>
                                </View>
                            </View>
                        </Fragment>}
                </View>
            </ScrollView>
        </Fragment>
    )
}

export default Detail