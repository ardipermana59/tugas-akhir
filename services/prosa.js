const fs = require('fs');
const fetch = require('node-fetch');

// Setup
const url = 'https://api.prosa.ai/v2/speech/tts';
const apiKey = '...';

(async () => {
  const filename = 'generated_audio.webm';
  const text = "Hasil akhir dari pekerjaan ini cukup memuaskan";

  try {
    const audioData = await tts(text, "opus");
    if (audioData) {
      fs.writeFileSync(filename, audioData);
      console.log('Audio saved to', filename);
    } else {
      console.log('Failed to generate audio');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();

async function tts(text, audio_format) {
  const job = await submitTtsRequest(text, audio_format);

  if (job && job.status === 'complete') {
    const base64AudioData = job.result.data;
    return Buffer.from(base64AudioData, 'base64');
  }
  // Job was not completed within the timeframe or failed
  return null;
}

async function submitTtsRequest(text, audio_format) {
  const payload = {
    config: {
      model: 'tts-dimas-formal',
      wait: true,  // Blocks the request until the execution is finished
      audio_format: audio_format
    },
    request: {
      text: text
    }
  };

  return request(url, 'POST', {
    json: payload,
    headers: {
      'x-api-key': apiKey
    }
  });
}

async function request(url, method, { headers = {}, json = null }) {
  const options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      ...headers
    },
    body: json ? JSON.stringify(json) : null
  };

  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
