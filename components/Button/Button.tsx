import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface MyButtonProps {
  onPress: () => void;
  text: string;
}

export const MyButton = ({ onPress, text }: MyButtonProps) => {
  return (
    <TouchableOpacity
      className="px-20"
      style={styles.container}
      onPress={onPress}
    >
      <Text
        className="text-white"
        style={styles.text}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    backgroundColor: "purple",
    alignSelf: "flex-start",
    borderRadius: 8,
  },
  text: { fontSize: 16, fontWeight: "bold" },
});
