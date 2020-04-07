import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    title_container: {
        marginTop: 40,
        marginBottom: 40,
        backgroundColor: 'transparent'
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginRight: 50,
        marginLeft: 50,
        marginBottom: 50,
        color: 'transparent'
    },
    userVeggie: {
        margin: 10,
    },
    title: {
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
        fontSize: 40,
        backgroundColor: 'transparent',
        fontWeight: '200'
    },
    subtitles: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 5
    },
    subtitles_special: {
        color: 'rgb(124, 65, 156)',
        fontSize: 20,
        marginTop: 20
    },
    subtitles_user_lands: {
        marginTop: 40,
        fontSize: 30,
        fontWeight: '200',
        alignSelf: 'center'
    },
    image: {
        height: 250,
        width: 250,
        flex: 2,
        alignSelf: 'center',
        marginBottom: 40
    },
    inline: {
        margin: 10
    },
    description: {
        lineHeight: 35,
        fontWeight: '200'
    },
    userVeggie_description: {
        marginTop: 30,
        color: 'rgb(126, 194, 144)',
        fontWeight: "500"
    },
    icons: {
        alignSelf: 'center',
    }
})

export default styles