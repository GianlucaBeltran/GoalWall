import { View, FlatList, StyleSheet } from "react-native";
import ListItem from "./ListItem";

export interface ListItemProps {
  id: string;
  clickable: boolean;
  header: string;
  navigation?: any;
}

export default function ListComponent({ data }: { data: ListItemProps[] }) {
  return (
    <View style={styles.container}>
      {/* <FlatList
        data={data}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item) => item.id}
      /> */}
      {data.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#D2D2D2",
  },
});
