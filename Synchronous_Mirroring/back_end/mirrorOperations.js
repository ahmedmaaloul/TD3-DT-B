const axios = require('axios');

const MIRROR_SERVER_BASE_URL = 'http://localhost:2000'; // Adjust this to your PostgreSQL server URL

async function mirrorOperationToPostgres(operation, data, endpoint) {
  const url = `${MIRROR_SERVER_BASE_URL}/${endpoint}`;
  console.log(url)
  
  try {
    let response;
    switch(operation) {
      case 'create':
        response = await axios.post(url, data);
        break;
      case 'update':
        response = await axios.put(url, data);
        break;
      case 'delete':
        response = await axios.delete(`${url}/${data.id}`); // Assuming 'data' includes an 'id' for the resource to delete
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
    console.log(`Mirror operation success: ${operation}`, response.data);
  } catch (error) {
    console.error(`Mirror operation failed: ${operation}`, error);
    // Handle rollback or error reporting as needed
    throw error; // Re-throw to handle at the caller level
  }
}

module.exports = { mirrorOperationToPostgres };
