
import React, { useEffect, useState } from 'react'
import { Calendar, CalendarList, Agenda } from 'react-native-calendars'
import { ScrollView, TouchableOpacity, View, Text } from 'react-native'
import { retrieveUserPlantations, retrieveItem } from '../../logic'
import styles from './style'
import moment from 'moment'
console.disableYellowBox = true

function GetCalendar({ goToCalendarModal }) {

    const allMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const [veggies, setVeggies] = useState()
    const [markedDates, setMarkedDates] = useState()
    const [currentMonth, setCurrentMonth] = useState(allMonths[new Date().getMonth()])
    const [veggiesOnMessage, setVeggiesOnMessage] = useState()
    const [veggieThisMonth, setVeggieThisMonth] = useState()

    let veggieThisMonthAll = []

    const veggieColor = [
        { name: 'spinach', color: "rgb(183, 222, 182)" },
        { name: 'tomatoes', color: "rgb(255, 190, 213)" },
        { name: 'carrots', color: "rgb(255, 193, 193)" },
        { name: 'strawberries', color: "rgb(255, 216, 179)" },
        { name: 'potatoes', color: "rgb(258, 235, 190)" },
    ]

    useEffect(() => {

        (async () => {

            let allUserVeggies, plantedVeggies = []
            let markedDatesHere = {}

            try {
                allUserVeggies = await retrieveUserPlantations()
                await Promise.all(allUserVeggies.map(async veg => {

                    if (veg.estTime) {

                        let retrievedVeg = await retrieveItem(veg.veggie)

                        let finalVeg = veggieColor.find(element => element.name === retrievedVeg.name)

                        plantedVeggies.push(veg)

                        let minDate = veg.estTime.split('-')[0].split('/')
                        let maxDate = veg.estTime.split('-')[1].split('/')

                        minDate[0].length === 1 ? minDate[0] = '0' + minDate[0] : ''
                        minDate[1].length === 1 ? minDate[1] = '0' + minDate[1] : ''
                        maxDate[0].length === 1 ? maxDate[0] = '0' + maxDate[0] : ''
                        maxDate[1].length === 1 ? maxDate[1] = '0' + maxDate[1] : ''

                        let newMinDate = minDate[2] + '-' + minDate[1] + '-' + minDate[0]

                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").format("YYYY-MM-DD")] = { startingDay: true, color: finalVeg.color }
                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").add(1, 'days').format("YYYY-MM-DD")] = { selected: true, color: finalVeg.color, textColor: 'gray' }
                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").add(2, 'days').format("YYYY-MM-DD")] = { selected: true, color: finalVeg.color, textColor: 'gray' }
                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").add(3, 'days').format("YYYY-MM-DD")] = { selected: true, color: finalVeg.color, textColor: 'gray' }
                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").add(4, 'days').format("YYYY-MM-DD")] = { selected: true, color: finalVeg.color, textColor: 'gray' }
                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").add(5, 'days').format("YYYY-MM-DD")] = { selected: true, color: finalVeg.color, textColor: 'gray' }
                        markedDatesHere[moment(newMinDate, "YYYY-MM-DD").add(6, 'days').format("YYYY-MM-DD")] = { selected: true, endingDay: true, color: finalVeg.color, textColor: 'gray' }

                        setMarkedDates(markedDatesHere)

                        return
                    }
                }))
                return setVeggies(plantedVeggies)
            } catch (error) {
                return console.log(error)
            }
        })()
    }, [])

    async function handleMonthChange(month) {
        let currentMonth = allMonths[month.month - 1]
        setCurrentMonth(currentMonth)
        let toHarvest = []
        let _retrievedVeggies = []

        try {
            await Promise.all(veggies.map(async veg => {

                let minDate = veg.estTime.split('-')[0].split('/')

                minDate[0].length === 1 ? minDate[0] = '0' + minDate[0] : ''
                minDate[1].length === 1 ? minDate[1] = '0' + minDate[1] : ''

                let newMinDate = minDate[2] + '-' + minDate[1] + '-' + minDate[0]

                let maxDate = moment(newMinDate, "YYYY-MM-DD").add(6, 'days').format("YYYY-MM-DD")

                let minMonth = minDate[1] - 1
                let maxMonth = maxDate.split('-')[1] - 1

                if (minMonth === month.month - 1 || maxMonth === month.month - 1) {

                    let veggie = await retrieveItem(veg.veggie)

                    _retrievedVeggies.push(veggie)

                    if (!toHarvest.includes(veggie.name)) {

                        toHarvest.push(veggie.name)
                    }
                    return
                }
            }))





            if (!toHarvest.length) return setVeggiesOnMessage(undefined)

            return setVeggiesOnMessage(toHarvest)

        }
        catch (error) {
            return console.log(error)
        }
    }

    function handleGetColor(veg) {

        let _veg = veggieColor.find(element => element.name === veg)

        return { fontSize: 30, color: _veg.color }

    }

    async function handleGoToCalendarModal(vegName) {

        let veggie = veggies.find(async element => {
            let retrievedVeg = await retrieveItem(element.id)
            retrievedVeg.name === vegName
        })

        veggieThisMonthAll.push(veggie)

        allUserPlantations = await retrieveUserPlantations()
        let veggiePlantations = await Promise.all(allUserPlantations.map(async veg => {

            if (veg.estTime) {
                let retrievedVeg = await retrieveItem(veg.veggie)
                return retrievedVeg.name === vegName ? veg.land : ''
            }
        }))


        return goToCalendarModal(vegName, currentMonth, veggiePlantations)
    }

    return (
        <ScrollView>
            <View>
                <Calendar
                    style={{
                        marginTop: 30,
                        height: 400
                    }}
                    theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: 'plum',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'rgb(126, 194, 144)',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: 'grey',
                        indicatorColor: 'grey',
                        textDayFontWeight: '300',
                        textMonthFontWeight: '200',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 20,
                        textMonthFontSize: 30,
                        textDayHeaderFontSize: 22,
                    }}

                    monthFormat={'MMM yyyy'}
                    disableMonthChange={true}
                    firstDay={1}
                    onPressArrowLeft={substractMonth => substractMonth()}
                    onPressArrowRight={addMonth => addMonth()}
                    hideExtraDays={true}
                    onMonthChange={(month) => handleMonthChange(month)}

                    markedDates={markedDates}
                    markingType={'period'} />

                {veggiesOnMessage &&
                    <>
                        <View style={styles.message_container}>
                            <Text style={styles.message}>{`You will harvest `}</Text>
                            {veggiesOnMessage && veggiesOnMessage.map(veg => {

                                if (veg !== veggiesOnMessage[veggiesOnMessage.length - 1]
                                    && veg !== veggiesOnMessage[veggiesOnMessage.length - 2])
                                    return (
                                        <TouchableOpacity onPress={() => handleGoToCalendarModal(veg)}>
                                            <Text style={handleGetColor(veg)}>{veg.toUpperCase()}, </Text>
                                        </TouchableOpacity>
                                    )

                                else if (veg === veggiesOnMessage[veggiesOnMessage.length - 2])
                                    return (
                                        <>
                                            <TouchableOpacity onPress={() => handleGoToCalendarModal(veg)}>
                                                <Text style={handleGetColor(veg)}>{veg.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.message}> and </Text>
                                        </>
                                    )

                                else if (veg === veggiesOnMessage[veggiesOnMessage.length - 1])
                                    return (
                                        <TouchableOpacity onPress={() => handleGoToCalendarModal(veg)}>
                                            <Text style={handleGetColor(veg)}>{veg.toUpperCase()}</Text>
                                        </TouchableOpacity>
                                    )


                            })}
                            < Text style={styles.message} > {` in ${currentMonth} !`}</Text>
                        </View>
                        < Text style={styles.description}>{`Click on veggie\'s name!`}</Text>
                    </>
                }
            </View>
        </ScrollView >
    )
}

export default GetCalendar
