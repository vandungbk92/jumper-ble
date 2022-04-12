import React from "react";
import {
    StyleSheet,
    View,
    TouchableOpacity,
} from "react-native";
import {
    FontAwesome,
    Ionicons,

} from "@expo/vector-icons";
import { Audio } from "expo-av";
import { KittenTheme } from "../../../../config/theme";
import {showToast} from "../../../epics-reducers/services/common";
import { RkText } from "react-native-ui-kitten";
import {postFile} from "../../../epics-reducers/services/fileServices";

export default function AudioUpload(props) {
    const [recording, setRecording] = React.useState();
    const [showRecord, setShowRecord] = React.useState();
    const [message, setMessage] = React.useState("");

    async function startRecording() {
        setShowRecord(null);
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );

                setRecording(recording);
            } else {
                setMessage(
                    "Please grant permission to app to access microphone"
                );
            }
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }

    async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        const { sound, status } = await recording.createNewLoadedSoundAsync();
        let updatedRecordings = {
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
        };
        setShowRecord(updatedRecordings);
    }

    const uploadAudio = async () => {
        const data = await postFile(`/uploads//${props.navigation.state.params.mabn}`, showRecord.file, 'files')
        if(data){
            showToast("Tải lên audio thành công!");
            showRecord.sound.unloadAsync()
            props.navigation.goBack();
        }else{
            showToast("Tải lên audio thất bại! Vui lòng thử lại");
        }
    };

    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }

    async function playSound() {
        await showRecord.sound.playAsync();
    }

    function getRecordingLines() {
        if (showRecord)
            return (
                <View style={styles.row}>
                    <RkText style={styles.fill}>
                        Bản ghi - {showRecord.duration}
                    </RkText>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                            onPress={playSound}
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Ionicons
                                name={"play"}
                                size={24}
                                color={KittenTheme.colors.appColor}
                                style={{ marginHorizontal: 4 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={uploadAudio}
                            style={{
                                flexDirection: "row",
                            }}
                        >
                            <Ionicons
                                name="cloud-upload-outline"
                                size={24}
                                color={KittenTheme.colors.appColor}
                                style={{ marginHorizontal: 4 }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        else return <View />;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ alignSelf: "center" }}
                onPress={recording ? stopRecording : startRecording}
            >
                <View
                    style={{
                        borderWidth: 1,
                        borderRadius: 35,
                        borderColor: "red",
                        backgroundColor: recording
                            ? KittenTheme.colors.transparent
                            : "red",
                        height: 70,
                        width: 70,
                        justifyContent: "center",
                        alignItems: "center",
                        marginVertical: 12,
                        marginHorizontal: 24,
                    }}
                >
                    {recording ? (
                        <FontAwesome name="square" size={32} color="red" />
                    ) : (
                        <FontAwesome
                            name="microphone"
                            size={40}
                            color="white"
                        />
                    )}
                </View>
            </TouchableOpacity>
            {getRecordingLines()}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 50,
        backgroundColor: "white",
        marginHorizontal: 8,
        borderRadius: 16,
        paddingHorizontal: 16,
    },
});
