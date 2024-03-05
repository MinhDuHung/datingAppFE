import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { getStoriesApi } from '../../utils/API/stories'
import Video from 'react-native-video'
import { findUserByIdApi } from '../../utils/API/user'
import { KANIT_BLACK_ITALIC, KANIT_ITALIC, KANIT_MEDIUM } from '../../assets/fonts/font'

const Activites = ({ navigation, route }: any) => {
  const refFlatlist = useRef<FlatList>(null)
  const { user, setUser }: any = useContext(AppContext)
  const [data, setData] = useState<any>([])
  const [_user, _setUser] = useState<any>()
  const { height, width } = Dimensions.get('window')
  const [_index, setIndex] = useState(0)
  const [viewableItems, setViewableItems] = useState(0);
  async function getStories() {
    try {
      const res = await axios.get(getStoriesApi, {
        params: {
          userId: route.params.userId
        }
      })
      if (res.status == 200) {
        setData(res.data)
      }
    }
    catch (error) {
      console.error('error getStories', error)
    }
  }

  const findUserById = async (_id: string) => {
    try {
      const res = await axios.get(findUserByIdApi, {
        params: {
          _id
        }
      })
      if (res.status == 200) {
        // console.log(res.data.user.lastName)
        _setUser(res.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const renderItem = ({ item, index }: any) => {
    const isVideo = item[_index]?.img?.includes('.mp4')
    const isPlay = index == viewableItems
    return (
      <Pressable style={{ flex: 1, backgroundColor: 'black' }}
        onPress={() => {
          if (_index < item.length - 1) {
            setIndex(prev => prev + 1);
          }
          else if (index < data.length - 1) {
            refFlatlist?.current?.scrollToIndex({ animated: true, index: index + 1 })
            setIndex(0)
          }
        }}
      >

        <View style={{ position: 'absolute', zIndex: 1, padding: 15, gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PreviewProfile', { chosenId: user._id })}
            style={{ height: 55, width: 55, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            {
              _user?.images[0] ?
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: _user.images[0] }}
                    style={{ height: 50, width: 50, borderRadius: 50, }}
                  />
                  <Text style={{ position: 'absolute', color: 'white', left: 70, fontFamily: KANIT_ITALIC, fontSize: 16 }}>{_user.firstName} {_user.lastName}</Text>
                </View>
                :
                <View
                  style={{ height: 50, width: 50, borderRadius: 50, }}
                />
            }
          </TouchableOpacity>
          <View style={{ width: width - 30, flexDirection: 'row', justifyContent: 'space-around' }}>
            {
              item.map((_item: any, index: any) => {
                return (
                  <View key={index}
                    style={{
                      height: 2, width: (width - 40) / item.length,
                      backgroundColor: index == _index ? 'white' : 'gray'
                    }} />
                )
              })
            }
          </View>
        </View>
        {
          isVideo && isPlay ?
            <Video
              style={{ width, height }}
              source={{ uri: item[_index]?.img }}
              resizeMode='contain'

            /> :
            <Image
              style={{ width, resizeMode: 'contain', height }}
              source={{ uri: item[_index]?.img || 'https://anhdep123.com/wp-content/uploads/2020/04/tom-m%C3%A8o-v%C3%A0-jerry.jpg' }}
            />
        }

      </Pressable >
    )
  }
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    setIndex(0)
    setViewableItems(viewableItems[0].index)
    // console.log(data[viewableItems[0].index][0]?.userId)
    findUserById(data[viewableItems[0].index][0]?.userId)
  };

  useEffect(() => {
    getStories()
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => (item + index).toString()}
        renderItem={renderItem}
        pagingEnabled
        ref={refFlatlist}
        horizontal
        initialNumToRender={1}
        removeClippedSubviews
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </View>
  )
}

export default Activites

const styles = StyleSheet.create({})