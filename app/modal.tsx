import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";
import { BaseLayout } from "@/components/ui/BaseLayout";
import { colors } from "@/src/styles/colors";

export default function Modal() {
    const [task, setTask] = useState("");
    const db = useSQLiteContext();

    const handleSave = async () => {
        try {
            await db.runAsync("INSERT INTO tasks (task) VALUES (?);", [task]);
            console.log("Task added successfully");
            router.back();
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    return (
        <BaseLayout>
            <View style={styles.container}>
                <Text style={styles.title}>Add a Task</Text>

                <TextInput
                    placeholder="Enter your task"
                    value={task}
                    onChangeText={setTask}
                    style={styles.textInput}
                />
                <Button title="Save Task" onPress={handleSave} />
                <Button title="Close" onPress={() => router.back()} />
            </View>
        </BaseLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: colors.white,
    },
    textInput: {
        width: "100%",
        padding: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#333",
    },
});
