import { View, Text, StyleSheet } from "react-native";
import ProfileSVG from "./svg/ProfileSVG";
import GenderFemaleSVG from "./svg/GenderFemaleSVG";

export default function AccountHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.profileImage}>
        <ProfileSVG />
      </View>
      <View style={styles.accountInfo}>
        <View style={styles.accountName}>
          <Text style={styles.header}>Friendly Frog</Text>
          <GenderFemaleSVG />
        </View>
        <View>
          <Text style={styles.subheader}>Profile Info</Text>
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
    marginBottom: 10,
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
