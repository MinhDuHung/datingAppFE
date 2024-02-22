import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { getStoriesApi } from '../../utils/API/stories'
import Video from 'react-native-video'

const Activites = ({ navigation, route }: any) => {
  const { user, setUser }: any = useContext(AppContext)
  const [data, setData] = useState([])
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
        // console.log(res.data)
      }
    }
    catch (error) {
      console.error('error getStories', error)
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
          else {
            setIndex(0)
          }
        }}
      >
        
        <View style={{ position: 'absolute', zIndex: 1, padding: 15, gap: 10 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('PreviewProfile', { chosenId: user._id })}
            style={{ height: 55, width: 55, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: user.images[0] }}
              style={{ height: 50, width: 50, borderRadius: 50, }}
            />
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

      </Pressable>
    )
  }
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    setIndex(0)
    setViewableItems(viewableItems[0].index)
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