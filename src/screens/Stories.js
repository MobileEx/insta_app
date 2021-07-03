import React, {useRef, useState, useEffect, Component} from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
// import Modal from 'react-native-modalbox';
import {CubeNavigationHorizontal} from 'react-native-3dcube-navigation';
import AllStories from '../constants/AllStories';
import StoryContainer from '../components/StoryContainer';
import axios from 'axios';

const Stories = (props) => {
  const [data, setData] = useState([]);
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState();
  const [currentScrollValue, setCurrentScrollValue] = useState();
  const modalScroll = useRef(null);

  useEffect(() => {
    getStories();
  }, []);
  const getStories = async () => {
    await axios
      .get(`https://app.instaperfil.com/beautifiedstories.json`)
      .then((res) => {
        const nameList = res.data;
        if (nameList.status === 'ok') {
          const storyData = nameList.data.reels_media;
          let array = [];
          let storiesArr = [];
          storyData.forEach(function (item, index) {
            let stories = item.items;
            stories.forEach(function (story, i) {
              storiesArr.push({
                url: story.is_video
                  ? story.video_resources[0].src
                  : story.display_url,
                type: story.__typename,
                duration: story.is_video ? story.video_duration : 5,
              });
            });
            array.push({
              username: item.owner.username,
              profile: item.owner.profile_pic_url,
              stories: storiesArr,
            });
            storiesArr = [];
          });
          setData(array);
          console.warn('data', data);
        }
      });
  };
  const onStorySelect = (index) => {
    console.warn(index);
    setCurrentUserIndex(index);
    setTimeout(() => {
      modalScroll.current.scrollTo(index, false);
    }, 100);
    setModel(true);
  };

  const onStoryClose = () => {
    setCurrentUserIndex(null);
    setModel(false);
  };

  const onStoryNext = (isScroll) => {
    const newIndex = currentUserIndex + 1;
    if (AllStories.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log('next');
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious();
      console.log('previous');
      setCurrentScrollValue(scrollValue);
    }
  };

  const renderSeperator = () => (
    <View style={{height: 1, backgroundColor: '#ccc'}} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        horizontal
        renderItem={({item, index}) => (
          <TouchableOpacity onPress={() => onStorySelect(index)}>
            <Image
              style={styles.circle}
              source={{uri: item.profile}}
              isHorizontal
            />
            <Text style={styles.title}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={data}
        ItemSeparatorComponent={renderSeperator}
        style={{paddingHorizontal: 10}}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => onStorySelect(index)}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image style={styles.circle} source={{uri: item.profile}} />
            <Text style={styles.title}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}>
        {/* eslint-disable-next-line max-len */}
        <CubeNavigationHorizontal
          callBackAfterSwipe={(g) => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}>
          {data.map((item, index) => (
            <StoryContainer
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              user={item}
              isNewStory={index !== currentUserIndex}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingVertical: 50,
    backgroundColor: 'rgba(255,255,255,255)',
  },
  circle: {
    width: 166,
    margin: 4,
    height: 166,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#72bec5',
    backgroundColor: 'grey',
  },
  modal: {
    flex: 1,
  },
  title: {
    fontSize: 9,
    textAlign: 'center',
  },
});

export default Stories;
