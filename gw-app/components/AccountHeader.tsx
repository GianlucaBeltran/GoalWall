import { View, Text, StyleSheet } from "react-native";
import ProfileSVG from "./svg/ProfileSVG";

export default function AccountHeader({
  userName,
  lastName,
  userUid,
}: {
  userName: string;
  lastName: string;
  userUid: string;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.profileImage}>
        <ProfileSVG />
      </View>
      <View style={styles.accountInfo}>
        <View style={styles.accountName}>
          <Text style={styles.header}>
            {userName} {lastName}
          </Text>
        </View>
        <View>
          <Text style={[styles.subheader, { color: "#8A8787" }]}>
            Member #{userUid}
          </Text>
        </View>
        <View>
          <Text style={styles.subheader}>Edit Profile</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  profileImage: {
    marginRight: 20,
  },
  accountInfo: { flex: 1 },
  accountName: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 20,
    fontWeight: 700,
  },
  subheader: {
    fontSize: 12,
    fontWeight: 400,
  },
});
