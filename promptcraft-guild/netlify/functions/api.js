const axios = require('axios');

// Configure environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

exports.handler = async (event, context) => {
  try {
    // Get the path and method from the request
    const path = event.path.replace(/^\/\.netlify\/functions\/api/, '');
    const method = event.httpMethod;
    
    console.log(`Proxying ${method} request to ${path}`);
    
    // Handle preflight CORS requests
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
        body: ''
      };
    }
    
    // Parse request body if it exists
    let requestBody;
    if (event.body) {
      try {
        requestBody = JSON.parse(event.body);
      } catch (error) {
        console.error('Error parsing request body:', error);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid request body' })
        };
      }
    }
    
    // Forward the request to the API
    const response = await axios({
      method,
      url: `${API_BASE_URL}${path}`,
      data: requestBody,
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if it exists
        ...(event.headers.authorization && { 
          'Authorization': event.headers.authorization 
        }),
        // Add API keys for services if needed
        ...(OPENAI_API_KEY && { 'X-OpenAI-Key': OPENAI_API_KEY }),
        ...(SUPABASE_URL && SUPABASE_KEY && { 
          'X-Supabase-URL': SUPABASE_URL,
          'X-Supabase-Key': SUPABASE_KEY
        })
      }
    });
    
    // Return the API response
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error proxying request:', error);
    
    // Return error response
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: error.response?.data || 'Internal Server Error',
        message: error.message
      })
    };
  }
}; 