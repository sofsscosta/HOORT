import React, { Fragment, useState, useEffect } from 'react'
import { FlatList, SectionList, TouchableOpacity, Text, View, Button, TextInput, Image, ScrollView } from 'react-native'
import styles from './style'
import { changeDivisions } from '../../logic'
import divisions from '../../assets/divisions_text.png'

function ChangeDivisions({ currentScheme, updateDivisions }) {

    const [scheme, setScheme] = useState(currentScheme)

    useEffect(() => {
        setScheme(currentScheme)
    }, [scheme])

    async function handleChangeDivisions(operation) {
        let _scheme
        try {
            _scheme = await changeDivisions(operation, scheme)
        } catch (error) {
            return console.log(error)
        }
        updateDivisions(_scheme.length)
        return setScheme(_scheme)
    }

    return (
        <Fragment>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.less}
                    onPress={() => {
                        return handleChangeDivisions('-')
                    }} />
                <Image
                    style={styles.divisions}
                    resizeMode='contain'
                    source={divisions} />
                <TouchableOpacity
                    style={styles.more}
                    onPress={() => handleChangeDivisions('+')} />
            </View>
        </Fragment>
    )
}

export default ChangeDivisions