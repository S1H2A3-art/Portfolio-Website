function generateSpeech(text) {
  let apiKey = "sk_a98a0ee9ceca6e006cdf06b7b889cd617aff0b2212f3d7e2"; // Replace with your own ElevenLabs API key.Check the access permission and make sure it has access to text to speech
//IMPORTANT: DELETE IT FROM YOUR SKETCH RIGHT AFTER THE TEMPORARY EXPERIMENT, YOU SHOULD NEVER EXPOSE YOUR API KEY IN PUBLICLY SHARED CODE
  
  let voiceId = "HAvvFKatz0uu0Fv55Riy";//replace with the ids of the voices you want to use, note that if you've reached the limit of custom voices, try using one of the default ones

  fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1", // Use an appropriate model
      voice_settings: { stability: 0.2, similarity_boost: 0.3 },
    }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      let audioURL = URL.createObjectURL(blob);
     
    audio = loadSound(audioURL, () => {
    audio.play();  
  });
    
    })
    .catch((error) => console.error("Error:", error));
}