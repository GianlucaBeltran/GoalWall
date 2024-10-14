import { View, Text, StyleSheet } from "react-native";

export default function CategoryTag({
  category,
  createButton,
  selected = false,
}: {
  category: string;
  createButton?: boolean;
  selected?: boolean;
}) {
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: selected ? "black" : "white",
          borderWidth: 1,
        },
      ]}
    >
      <Text style={styles.tagText}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 37,
    backgroundColor: "#EDECEC",
    padding: 10,
    borderRadius: 15,
    marginRight: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: 500,
  },
});
