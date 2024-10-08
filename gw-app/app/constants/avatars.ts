export interface Avatar {
  id: string;
  image: any;
  fileName: string;
}

const Avatars = [
  {
    id: "0",
    image: require("../../assets/images/avatar1.png"),
    fileName: "avatar1.png",
  },
  {
    id: "1",
    image: require("../../assets/images/avatar2.png"),
    fileName: "avatar2.png",
  },
  {
    id: "2",
    image: require("../../assets/images/avatar3.png"),
    fileName: "avatar3.png",
  },
  {
    id: "3",
    image: require("../../assets/images/avatar4.png"),
    fileName: "avatar4.png",
  },
  {
    id: "4",
    image: require("../../assets/images/avatar5.png"),
    fileName: "avatar5.png",
  },
  {
    id: "5",
    image: require("../../assets/images/avatar6.png"),
    fileName: "avatar6.png",
  },
  {
    id: "6",
    image: require("../../assets/images/avatar7.png"),
    fileName: "avatar7.png",
  },
];

export default Avatars;

export const getAvatar = (fileName: string): Avatar | null => {
  const avatar = Avatars.find((avatar) => avatar.fileName === fileName);
  if (!avatar) return null;
  return avatar;
};
