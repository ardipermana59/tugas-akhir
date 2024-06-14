const fetch = require('node-fetch');

const url = 'https://api.v6.unrealspeech.com/speech';

const createSpeechRequest = (message) => {
  const token = process.env.UNREAL_SPEECH_TOKEN
  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      Text: message,
      VoiceId: 'Scarlett',
      Bitrate: '192k',
      Speed: '-0.2',
      Pitch: '1',
      TimestampType: 'sentence'
    })
  };

  return fetch(url, options)
    .then(res => res.json())
    .catch(err => {
      console.error('error:', err);
      throw err;
    });
};

module.exports = createSpeechRequest;
