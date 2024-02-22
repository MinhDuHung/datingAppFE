import { Dimensions, FlatList, Image, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { KANIT_BOLD, KANIT_MEDIUM, KANIT_REGULAR, KANIT_THIN } from '../../assets/fonts/font'
import { BG, MAIN_COLOR } from '../../assets/color'
const { height, width } = Dimensions.get('window')
const Onboarding = ({ navigation }: any) => {
  const data = [
    {
      title: 'Algorithm',
      content: 'Users going through a vetting process to ensure you never match with bots.',
      img: require('../../assets/images/girl2.png')
    },
    {
      title: 'Matches',
      content: 'We match you with people that have a large array of similar interests.',
      img: require('../../assets/images/girl2-1.png')
    },
    {
      title: 'Premium',
      content: 'Sign up today and enjoy the first month of premium benefits on us.',
      img: require('../../assets/images/girl2-2.png')
    }
  ]

  const [Index, setIndex] = useState(0)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffff' }}>
      <View style={{ flex: 1, marginVertical: 20 }}>
        <FlatList data={data}
          renderItem={({ item, index }: any) => {
            return (
              <Animated.Image source={item.img} style={[{ height: index == Index ? height * .45 : height * .4, width: width * .7, borderRadius: 15 }]} />
            )
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
          onScroll={(e) => {
            console.log(Math.round(e.nativeEvent.contentOffset.x))
            setIndex(Math.round(e.nativeEvent.contentOffset.x / 245))
          }}
          snapToInterval={240}
          // pagingEnabled
          keyExtractor={item => item.img}
          contentContainerStyle={{ gap: 20, alignItems: 'center' }}
        />
      </View>
      <View style={styles.below}>
        <Text style={styles.title}>{Index == height * .4 ? data[0].title : data[Index].title}</Text>
        <Text style={styles.content}>{Index == height * .4 ? data[0].content : data[Index].content}</Text>
        <View style={styles.signal}>
          {
            data.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setIndex(index)}
                  key={index} style={{ height: 10, width: 10, borderRadius: 10, backgroundColor: index == Index ? MAIN_COLOR : BG }} />
              )
            })
          }
        </View>

        <TouchableOpacity style={styles.btn}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.btnTxt}>Create an account</Text>
        </TouchableOpacity>
        <Text style={styles.content}>Already have an account? <Text
          onPress={() => navigation.navigate('Signin')}
          style={styles.title}>Sign In</Text></Text>
      </View>
    </SafeAreaView>
  )
}

export default Onboarding

const styles = StyleSheet.create({
  title: {
    fontFamily: KANIT_BOLD, color: MAIN_COLOR,
    fontSize: 25,
  },
  content: {
    fontFamily: KANIT_THIN, color: 'black',
    fontSize: 20, textAlign: 'center'
  },
  below: {
    flex: 1, justifyContent: 'space-evenly', alignItems: 'center', paddingHorizontal: 20
  },
  signal: { height: 30, width: 70, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  btn: { height: height * .07, width: width * .8, justifyContent: 'center', alignItems: 'center', backgroundColor: MAIN_COLOR, borderRadius: 30 },
  btnTxt: {
    fontFamily: KANIT_MEDIUM, color: 'white',
    fontSize: 20, textAlign: 'center'
  }
})