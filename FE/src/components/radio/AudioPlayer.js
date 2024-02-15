import React, { useEffect, useState } from "react";

function AudioPlayer({ response }) {
    const [audioUrl, setAudioUrl] = useState("");

    function playAudio() {
        const audioPlayer = new Audio(audioUrl);
        audioPlayer.play();
    }

    // 오디오 Blob을 URL로 변환하여 상태에 저장합니다.
    useEffect(() => {
        if (response && response.data) {
            console.log(response.data); // forTest
            const url = URL.createObjectURL(new Blob([response.data], { type: "audio/wav" }));
            console.log(url); // forTest
            setAudioUrl(url);
        }
    }, [response]);

    return (
        <div>
            <button onClick={playAudio}>오디오 재생</button>
            {audioUrl && <audio controls src={audioUrl} />}
        </div>
    );
}

export default AudioPlayer;
