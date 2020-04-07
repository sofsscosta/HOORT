import React, { Fragment, useState } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { updateUser } from '../../logic'
import styles from './style'
import { Button, Feedback } from '../'

function EditProfile() {

    const [error, setError] = useState()
    const [message, setMessage] = useState()
    const [name, setName] = useState()
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [oldPassword, setOldPassword] = useState()
    const [newPassword, setNewPassword] = useState()

    async function update(name, username, email, oldPassword, newPassword) {

        let updates = {}

        if (name) updates.name = name
        if (username) updates.username = username
        if (email) updates.email = email
        if (oldPassword) updates.oldPassword = oldPassword
        if (newPassword) updates.newPassword = newPassword

        try {
            await updateUser(updates)
            return setMessage('Successfully changed fields!')
        }
        catch (error) {
            // if (error.message === 'JSON Parse error: Unexpected EOF')
            //     setMessage('successfully changed fields!')

            // else 
            setError(error.message)
        }
    }

    return (
        <Fragment>
            <ScrollView >
                <TouchableWithoutFeedback onPress={() => setError(undefined)}>
                    <View style={styles.container}>
                        <Text style={styles.title}>EDIT PROFILE</Text>
                        <Text style={styles.description}>Change all the fields you want and click on submit changes.</Text>
                        <View style={styles.subtitle_container}>
                            <Text style={styles.subtitle}>CHANGE NAME</Text>
                        </View>
                        <TextInput
                            onChangeText={(name) => setName(name)}
                            style={styles.input}
                            placeholder='New name'>
                        </TextInput>
                        <View style={styles.subtitle_container}>
                            <Text style={styles.subtitle}>CHANGE USERNAME</Text>
                        </View>
                        <TextInput
                            onChangeText={(username) => setUsername(username)}
                            style={styles.input}
                            placeholder='New username'
                            title='username'>
                        </TextInput>
                        <View style={styles.subtitle_container}>
                            <Text style={styles.subtitle}>CHANGE EMAIL</Text>
                        </View>
                        <TextInput
                            onChangeText={(email) => setEmail(email)}
                            style={styles.input}
                            placeholder='New email'
                            title='email'>
                        </TextInput>
                        <View style={styles.subtitle_container}>
                            <Text style={styles.subtitle}>CHANGE PASSWORD</Text>
                        </View>
                        <TextInput
                            secureTextEntry={true}
                            onChangeText={(password) => setOldPassword(password)}
                            style={styles.input}
                            placeholder="Old password"
                            title='oldPassword'>
                        </TextInput>
                        <TextInput
                            secureTextEntry={true}
                            onChangeText={(password) => setNewPassword(password)}
                            style={styles.input}
                            placeholder="New password"
                            title='newPassword'></TextInput>
                        <View style={{ marginTop: 40, marginBottom: 50 }}>
                            <Button
                                text='Submit changes'
                                type='submit'
                                onPress={() => {
                                    setMessage(undefined)
                                    setError(undefined)

                                    return update(name, username, email, oldPassword, newPassword)
                                }} />
                        </View>
                        {error &&
                            <View style={styles.feedback}>
                                <Feedback level='error' message={error} />
                            </View>

                            || message &&
                            <View style={styles.feedback}>
                                <Feedback level='warning' message={message} />
                            </View>
                        }
                    </View>
                </TouchableWithoutFeedback >
            </ScrollView >
        </Fragment >
    );
};

export default EditProfile