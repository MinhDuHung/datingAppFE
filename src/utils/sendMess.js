export const handleSendMess = async () => {
    if (text != '' || media) {
      socketServices.emit(concatenateAndSort(user._id, specifiedUser.current._id), {
        sender: user._id,
        img: media?.img ? url.current : '',
        text: text,
        music: '',
        video: '',
        time: new Date()
      })
      setText('')
      try {
        const res = await axios.post(insertDataToChatRoomApi, {
          mainId: concatenateAndSort(user._id, specifiedUser.current._id),
          content: {
            sender: user._id,
            img: media?.img ? url.current : '',
            text: text,
            music: '',
            video: '',
            time: new Date()
          }
        })
        if (res.status == 200) {
        }
      } catch (error) {
        console.error(error)
      }
    }
  }