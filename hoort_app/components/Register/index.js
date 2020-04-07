import React, { Fragment, useState } from 'react';
import { View, Text, StatusBar, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { registerUser } from '../../logic'
import styles from './style'
import { Button, Feedback } from '../'

function Register({ goToLogin }) {

    const [error, setError] = useState()
    const [name, setName] = useState()
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    async function register(name, username, email, password) {

        try {
            await registerUser(name, username, email, password)
            goToLogin()
        }
        catch (error) {
            return setError(error.message)
        }
    }

    return (
        <Fragment>
            <TouchableWithoutFeedback onPress={() => setError(undefined)}>
                <View style={styles.container}>
                    <Text style={styles.title}>REGISTER</Text>
                    <TextInput
                        onChangeText={(name) => setName(name)}
                        style={styles.input}
                        placeholder='Your name here...'>
                    </TextInput>
                    <TextInput
                        onChangeText={(username) => setUsername(username)}
                        style={styles.input}
                        placeholder='Your unique username!'
                        title='username'>
                    </TextInput>
                    <TextInput
                        onChangeText={(email) => setEmail(email)}
                        style={styles.input}
                        placeholder='Email'
                        title='email'>
                    </TextInput>
                    <TextInput
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                        style={styles.input}
                        placeholder="Password"
                        title='password'>
                    </TextInput>
                    <Button
                        text='Register'
                        type='submit'
                        onPress={() => {
                            setError(undefined)

                            return register(name, username, email, password)
                        }} />
                    <Button
                        text='Sign in'
                        type='redirect'
                        onPress={() => {
                            setError(undefined)

                            return goToLogin()
                        }} />
                    {error &&
                        <View style={styles.feedback}>
                            <Feedback level='error' message={error} />
                        </View>
                    }
                </View>
            </TouchableWithoutFeedback>
        </Fragment>
    );
};

export default Register