import axios from "axios";

const API_URL = "/api/tickets";

// create ticket
const createTicket = async (ticketData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => status >= 200 && status < 300,
  };
  const response = await axios.post(API_URL, ticketData, config);
  return response.data;
};

// get tickets
const getTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => status >= 200 && status < 300,
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};
// get ticket
const getTicket = async (ticketId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => status >= 200 && status < 300,
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

const ticketService = {
  createTicket,
  getTickets,
  getTicket
};
export default ticketService;
