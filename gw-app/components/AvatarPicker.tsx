import {
  AppAction,
  AppActionType,
  AppContext,
  AppDispatchContext,
} from "@/app/context/appContext";
import { router } from "expo-router";
import { Dispatch, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from "react-native";

export function AvatarButton({
  dispatch,
  avatar,
  appDataAvatar,
  handleAvatarSelection,
}: {
  dispatch: Dispatch<AppAction> | null;
  avatar: string;
  appDataAvatar: string | null | undefined;
  handleAvatarSelection: (avatar: string) => void;
}) {
  const appData = useContext(AppContext);
  return (
    <TouchableOpacity
      activeOpacity={appData?.user?.avatarFileName === avatar ? 1 : 0.6}
      onPress={() => {
        handleAvatarSelection(avatar);
      }}
      disabled={appDataAvatar === avatar}
    >
      <Image
        source={{ uri: appData?.api + "/user/avatar/" + avatar }}
        style={{
          width: 75,
          height: 75,
          borderRadius: 75,
          borderColor:
            appDataAvatar === avatar || appData?.user?.avatarFileName === avatar
              ? "black"
              : "",
          borderWidth:
            appDataAvatar === avatar || appData?.user?.avatarFileName === avatar
              ? 2
              : 0,
          opacity:
            appDataAvatar === avatar || appData?.user?.avatarFileName === avatar
              ? 0.6
              : 1,
        }}
      />
    </TouchableOpacity>
  );
}

function AvatarGrid({
  avatars,
  dispatch,
  editingAvatar,
  handleAvatarSelection,
}: {
  avatars: string[];
  dispatch: Dispatch<AppAction> | null;
  editingAvatar: string;
  handleAvatarSelection: (avatar: string) => void;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        // justifyContent: "center",
        paddingRight: 30,
        paddingLeft: 30,
      }}
    >
      <View style={styles.avatarsContainer}>
        {avatars.slice(0, 2).map((avatar, index) => (
          <AvatarButton
            key={avatar}
            dispatch={dispatch}
            avatar={avatar}
            appDataAvatar={editingAvatar}
            handleAvatarSelection={handleAvatarSelection}
          />
        ))}
      </View>
      <View style={styles.avatarsContainer}>
        {avatars.slice(2, 5).map((avatar, index) => (
          <AvatarButton
            key={avatar}
            dispatch={dispatch}
            avatar={avatar}
            appDataAvatar={editingAvatar}
            handleAvatarSelection={handleAvatarSelection}
          />
        ))}
      </View>
      <View style={styles.avatarsContainer}>
        {avatars.slice(5, 7).map((avatar, index) => (
          <AvatarButton
            key={avatar}
            dispatch={dispatch}
            avatar={avatar}
            appDataAvatar={editingAvatar}
            handleAvatarSelection={handleAvatarSelection}
          />
        ))}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
//you need to preview n items.
const previewCount = 1;
//to center items
//the screen will show `previewCount` + 1/4 firstItemWidth + 1/4 lastItemWidth
//so for example if previewCount = 3
//itemWidth will be =>>> itemWidth = screenWidth / (3 + 1/4 + 1/4)
const itemWidth = width;
//to center items you start from 3/4 firstItemWidth

export default function AvatarPicker({
  handleAvatarSelection,
}: {
  handleAvatarSelection: (avatar: string) => void;
}) {
  const [avatars, setAvatars] = useState<string[]>([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [pickerWidth, setPickerWidth] = useState(0);

  const appData = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);

  const flatlistRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!appData?.api) return;
    // if (avatars.length) return;
    (async () => {
      try {
        const response = await fetch(appData?.api + "/user/avatars");

        const images = await response.json();

        setAvatars(images.images);
      } catch (error: any) {
        console.error(error.message);
      }
    })();
  }, [scrollIndex]);

  const avatarsScrollView = avatars.reduce((acc, avatar, index) => {
    if (index % 7 === 0) {
      acc.push([]);
    }
    acc[acc.length - 1].push(avatar);
    return acc;
  }, [] as string[][]);

  const snapToOffsets = avatarsScrollView.map((x, i) => {
    return i * itemWidth * previewCount;
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        marginRight: -20,
        marginLeft: -20,
      }}
    >
      <FlatList
        ref={flatlistRef}
        data={avatarsScrollView}
        pagingEnabled
        initialNumToRender={2}
        horizontal
        snapToOffsets={snapToOffsets}
        decelerationRate={"fast"}
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={(viewableItems) => {
          const isViewable = viewableItems.viewableItems[0].isViewable;
          if (
            isViewable &&
            viewableItems.viewableItems[0].index !== undefined
          ) {
            setScrollIndex(viewableItems.viewableItems[0].index!);
          }
        }}
        contentContainerStyle={{
          alignItems: "center",
          //   marginBottom: 30,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: itemWidth - 20, //20 is margin left and right
              margin: 10,
              borderRadius: 10,
            }}
          >
            <AvatarGrid
              avatars={item}
              dispatch={dispatch}
              editingAvatar={appData?.user?.avatarFileName || ""}
              handleAvatarSelection={handleAvatarSelection}
            />
          </View>
        )}
      />
      <View style={styles.slideButtons}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.slideButton,
              { backgroundColor: index === scrollIndex ? "black" : "#AEAEAE" },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  costumeAvatar: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 173,
    overflow: "hidden",
    marginBottom: 30,
  },
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 30,
  },
  avatar: {
    width: 75,
    height: 75,
    // backgroundColor: "red",
    borderRadius: 75,
    overflow: "hidden",
  },
  slideButtons: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 20,
  },
  slideButton: {
    width: 8.5,
    height: 8.5,
    borderRadius: 8.5,
  },
});
