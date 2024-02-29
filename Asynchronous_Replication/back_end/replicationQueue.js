// replicationQueue.js
const axios = require('axios');
const MIRROR_SERVER_BASE_URL = 'http://localhost:2000'; // Replace with your secondary server's base URL

const replicationQueue = [];

function addToReplicationQueue(operation, data, endpoint) {
  replicationQueue.push({ operation, data, endpoint });
  console.log(`Operation "${operation}" added to the queue for endpoint "${endpoint}"`);
}

async function processReplicationQueue() {
  while (replicationQueue.length > 0) {
    const { operation, data, endpoint } = replicationQueue.shift();
    const url = `${MIRROR_SERVER_BASE_URL}/${endpoint}`;
    
    try {
      let response;
      switch (operation) {
        case 'create':
          response = await axios.post(url, data);
          break;
        case 'update':
          response = await axios.put(url, data);
          break;
        case 'delete':
          response = await axios.delete(`${url}/${data.id}`);
          break;
        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
      console.log(`Replication operation success: ${operation}`, response.data);
    } catch (error) {
      console.error(`Replication operation failed: ${operation}`, error);
    }
  }
}

setInterval(processReplicationQueue, 5000); 

module.exports = {
  addToReplicationQueue,
  processReplicationQueue,
};
