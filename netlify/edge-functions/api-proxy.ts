import type { Context } from "@netlify/edge-functions";

const API_KEY = '72njgfa948d9aS7gs5';
const API_BASE = 'https://stageapi.monkcommerce.app';

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Remove /api prefix and forward to actual API
  const apiPath = url.pathname.replace(/^\/api/, '');
  const targetUrl = `${API_BASE}${apiPath}${url.search}`;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.text();
    
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch from API' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

export const config = {
  path: "/api/*",
};

