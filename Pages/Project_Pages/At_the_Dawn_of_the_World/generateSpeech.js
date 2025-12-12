let audio;
let voices = [["4Mpyxgccbrbm0Niml3Wq",{stability: 0.91, style: 0, speed:0.84, similarity_boost:0.9}],["LyEHDxr2VWd2J5ybctl9",{stability: 0.16, style: 0.77, speed:0.94, similarity_boost:0.09}],["nECZV1YvlhfAIrWf2dx8",{stability: 0.5, style: 0.25, speed:0.8, similarity_boost:0.70}],["v9I7auPeR1xGKYRPwQGG",{stability: 0.5, similarity_boost: 0.5, speed:1.2}]];
let creatorVoice = [["qgbscUnALKEy4SIr5qfL",{stability: 0.5, style: 0.07, speed:0.82, similarity_boost:0.75}]];

const speechCache = new Map();

function getSpeechCacheKey(text, voiceId, settings){
  return `${voiceId}|${settings.stability}|${settings.style}|${settings.speed}|${settings.similarity_boost}|${text}`;
}

function fetchSpeechBlob(text, voiceId, settings){
  const cacheKey = getSpeechCacheKey(text, voiceId, settings);
  if(!speechCache.has(cacheKey)){
    const apiKey = "125708c3f8295ef2fdf700fb43f9d8225db67e730b2d00854368adf0f9442b0f"; // Replace with your own ElevenLabs API key.Check the access permission and make sure it has access to text to speech
    //IMPORTANT: DELETE IT FROM YOUR SKETCH RIGHT AFTER THE TEMPORARY EXPERIMENT, YOU SHOULD NEVER EXPOSE YOUR API KEY IN PUBLICLY SHARED CODE
    const fetchPromise = fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: "POST",
      headers: {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1", // Use an appropriate model
        voice_settings: { stability: settings.stability, style: settings.style, speed:settings.speed, similarity_boost: settings.similarity_boost},
      }),
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`TTS request failed: ${response.status} ${await response.text()}`);
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("audio")) {
        throw new Error(`Expected audio, got ${contentType}: ${await response.text()}`);
      }

      return response.blob();
    });
    speechCache.set(cacheKey, fetchPromise);
  }
  return speechCache.get(cacheKey);
}

function generateSpeech(text,voice,onEnded,settings,{autoplay = true} = {}) {
  const voiceId = voice;

  fetchSpeechBlob(text, voiceId, settings)
    .then((blob) => {
      const audioURL = URL.createObjectURL(blob);
      if (autoplay && audio) {
        audio.stop();
      }
      const sound = loadSound(audioURL, () => {
        if(autoplay){
          audio = sound;
          audio.play();
          if (onEnded) {
            audio.onended(onEnded);
          }
        }else if(onEnded){
          sound.onended(onEnded);
        }
        URL.revokeObjectURL(audioURL);
      });
      if(!autoplay){
        return sound;
      }
    })
    .catch((error) => {
      console.error("TTS error:", error);
      if (onEnded) {
        onEnded();
      }
    });
}
