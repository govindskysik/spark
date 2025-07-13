import axios from 'axios';
import API_CONFIG from '../config/api';

const agentClient = axios.create({
  baseURL: API_CONFIG.BASE_URL_AGENT,
  timeout: 100000,
});

const agentService = {
  getAgentResponse: async ({ user_name, user_age, user_input, last_response_id = '', use_structuring = false }) => {
    const body = {
      user_name,
      user_age,
      user_input,
      last_response_id,
      use_structuring
    };

    const response = await agentClient.post('/agent_response', body);
    return response.data;
  }
};

export default agentService;
