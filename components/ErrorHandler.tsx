import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {ErrorState} from "@/types";

interface ErrorHandlerProps {
    readonly error: ErrorState | null;
    onDismiss: () => void;
}

export default function ErrorHandler({error, onDismiss}: ErrorHandlerProps) {
    if (!error) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{error.message}</Text>
            <TouchableOpacity style={styles.button} onPress={onDismiss}>
                <Text style={styles.buttonText}>Закрыть</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffebee",
        padding: 16,
        margin: 16,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#f44336",
    },
    message: {
        fontSize: 16,
        marginBottom: 12,
        color: "#333",
    },
    button: {
        backgroundColor: "#f44336",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        alignSelf: "flex-start",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});
