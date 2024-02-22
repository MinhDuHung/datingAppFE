import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import Header from '../../components/Header'
import { KANIT_MEDIUM } from '../../assets/fonts/font'
import { MAIN_COLOR } from '../../assets/color'
import { launchImageLibrary } from 'react-native-image-picker'
import Video from 'react-native-video'
import { AppContext } from '../../context/AppContext'
import storage from '@react-native-firebase/storage';
import axios from 'axios'
import { postStoriesApi } from '../../utils/API/stories'

const PostActivity = ({ navigation }: any) => {
    const { user, setUser }: any = useContext(AppContext)
    const [media, setMedia] = useState<any>({ img: 'https://anhdep123.com/wp-content/uploads/2020/04/tom-m%C3%A8o-v%C3%A0-jerry.jpg' })
    async function handleOpenGallery() {
        let options: any = {
            mediaType: 'photo',
            type: 'library',
            includeBase64: true,
        }
        launchImageLibrary(options, respone => {
            if (respone.didCancel) {
                console.log('User cancelled image picker')
            }
            else if (respone.errorCode) {
                console.log(respone.errorCode)
            }
            else {
                const media: any = respone.assets
                const newImageUri = media[0].uri;
                setMedia({ img: newImageUri })
            }
        })
    }
    async function handleOpenVideo() {
        let options: any = {
            mediaType: 'video',
            type: 'library',
            includeBase64: true,
        }
        launchImageLibrary(options, respone => {
            if (respone.didCancel) {
                console.log('User cancelled image picker')
            }
            else if (respone.errorCode) {
                console.log(respone.errorCode)
            }
            else {
                const media: any = respone.assets
                const newImageUri = media[0].uri;
                setMedia({ video: newImageUri })
            }
        })
    }

    async function handleInsertIntoDB(url: string) {
        try {
            const res = await axios.post(postStoriesApi, {
                userId: user._id,
                img: url,
                viewCount: 0,
                music: ''
            })
            if (res.status == 200) {
                navigation.goBack()
            }
        }
        catch (error) {
            console.error('uploadImg chat error ', error)
        }
    }

    async function handleUploadStory() {
        const uri = media?.img ? media.img : media.video
        try {
            const fileName = `${user.emailAndPhone}/stories/${uri.substring(uri.lastIndexOf('/') + 1)}`;
            await storage().ref(fileName).putFile(uri);
            const url: any = await storage().ref(fileName).getDownloadURL()
            await handleInsertIntoDB(url)
        }
        catch (error) {
            console.error('uploadImg chat error ', error)
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <Header navigation={navigation} headerIcon={'chevron-back-circle'} headerTitle={'Post your story'} />
            <View style={{ flex: 8, backgroundColor: 'red' }}>
                {
                    media?.img ? <Image
                        source={{ uri: media.img }}
                        style={styles.media} /> :
                        <Video
                            source={{ uri: media?.video }}
                            resizeMode='contain'
                            style={styles.media} />
                }

                <View style={styles.controll}>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleOpenGallery()}
                    >
                        <Text style={styles.txt}>Choose image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleOpenVideo()}
                    >
                        <Text style={styles.txt}>Choose video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => handleUploadStory()}
                    >
                        <Text style={styles.txt}>Upload story</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default PostActivity

const styles = StyleSheet.create({
    controll: {
        position: 'absolute', bottom: 50, justifyContent: 'space-evenly', alignItems: 'center', width: '100%', flexDirection: 'row',
    },
    btn: {
        height: 40, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 15,
        backgroundColor: MAIN_COLOR,
    },
    txt: {
        fontFamily: KANIT_MEDIUM, color: 'white', fontSize: 16
    },
    media: {
        height: '100%', width: '100%',
    }
})