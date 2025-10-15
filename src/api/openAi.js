import axios from 'axios';
import { OPEN_AI_KEY } from '@env';

const chatGptEndpoint = 'https://api.openai.com/v1/chat/completions';
const dalleEndpoint = 'https://api.openai.com/v1/images/generations';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Create a fresh axios instance for each retry to avoid connection reuse issues
const freshClient = axios.create({
  headers: {
    Authorization: 'Bearer ' + OPEN_AI_KEY,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30000,
  // Force fresh connections
  maxRedirects: 0,
  validateStatus: () => true, // Don't throw on any status
});

export const apiCall = async (prompt, messages, retryCount = 0) => {
  const maxRetries = 2;
  try {
    const res = await freshClient.post(chatGptEndpoint, {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Does this message want to generate an AI image, art, or anything similar? ${prompt} . Simply answer with a yes or no.`,
        },
      ],
    });

    // Handle non-2xx responses manually
    if (res.status >= 200 && res.status < 300) {
      let isArt = res.data.choices[0].message.content;
      if (isArt.toLowerCase().includes('yes')) {
        console.log('dalle api call');
        return dalleApiCall(prompt, messages || []);
      } else {
        console.log('chat gpt api call');
        return chatGptApiCall(prompt, messages || []);
      }
      //   return res.data;
    } else {
      throw {
        response: {
          status: res.status,
          headers: res.headers,
          data: res.data,
        },
      };
    }
  } catch (error) {
    // Log rich error details to diagnose common axios "Network Error" cases
    if (error.response) {
      console.log('openai error response', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
      return Promise.resolve({
        success: false,
        msg: `HTTP ${error.response.status}`,
      });
    }
    if (error.request) {
      console.log('openai no response (request made, no reply)', {
        readyState: error.request.readyState,
        responseURL: error.request.responseURL,
        retryCount,
      });

      // Retry logic for iOS Simulator networking issues
      if (retryCount < maxRetries) {
        console.log(`Retrying in ${1000 * (retryCount + 1)}ms...`);

        // Skip connectivity test - simulator networking is unreliable
        console.log('Skipping connectivity test, attempting direct retry...');

        await delay(1000 * (retryCount + 1)); // Exponential backoff: 1s, 2s
        return apiCall(prompt, messages, retryCount + 1);
      }

      return Promise.resolve({
        success: false,
        msg: 'No response received from server after retries',
      });
    }
    console.log('openai request setup error', error.message);
    return Promise.resolve({ success: false, msg: error.message });
  }
};

const chatGptApiCall = async (prompt, messages) => {
  try {
    const res = await freshClient.post(chatGptEndpoint, {
      model: 'gpt-4o-mini',
      messages,
    });
    let answer = res.data?.choices[0]?.message?.content;
    console.log('got answer', answer);
    messages.push({ role: 'assistant', content: answer.trim() });
    return Promise.resolve({ success: true, data: messages });
  } catch (error) {
    return Promise.resolve({ success: false, msg: error.message });
  }
};

const dalleApiCall = async (prompt, messages) => {
  try {
    const res = await freshClient.post(dalleEndpoint, {
      model: 'dall-e-2',
      prompt,
      n: 1,
      size: '512x512',
    });

    let url = res?.data?.data[0]?.url;
    console.log('got url of image', url);
    messages.push({ role: 'assistant', content: url });
    return Promise.resolve({ success: true, data: messages });
  } catch (error) {
    return Promise.resolve({ success: false, msg: error.message });
  }
};
