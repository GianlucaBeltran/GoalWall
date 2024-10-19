import { Reaction } from "@/app/types/data.types";
import { View, Text } from "react-native";

export default function ReactionsDisplay({
  reactions,
}: {
  reactions: Reaction[];
}) {
  const reactionsSet = new Set(reactions.map((reaction) => reaction.type));
  const sortedReactions = Array.from(reactionsSet).sort();
  const amountOfReactions = reactions.length;
  return (
    <>
      {amountOfReactions > 0 && (
        <View
          style={{
            flexDirection: "row",
            gap: 5,
          }}
        >
          {sortedReactions.map((reaction, index) => (
            <View key={index}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#686868",
                }}
              >
                {reaction}
              </Text>
            </View>
          ))}
          <Text
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#686868",
            }}
          >
            {amountOfReactions}
          </Text>
        </View>
      )}
    </>
  );
}
