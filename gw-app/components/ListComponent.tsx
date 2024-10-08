import { View, FlatList, StyleSheet } from "react-native";
import ListItem from "./ListItem";

export interface ListItemProps {
  id: string;
  clickable: boolean;
  header: string;
  navigation?: any;
  svg?: React.ReactNode;
}

export default function ListComponent({ data }: { data: ListItemProps[] }) {
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <ListItem key={item.id} item={item} svg={item.svg} />
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
