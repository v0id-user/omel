import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app';
import { NextRequest, NextResponse } from 'next/server';

const handleRequest = async (req: NextRequest) => {
  // Create response headers that we'll pass to the context
  const resHeaders = new Headers();

  const response = await fetchRequestHandler({
    endpoint: '/api/v1',
    req,
    router: appRouter,
    createContext: async () => {
      return createTRPCContext({
        req,
        resHeaders,
      });
    },
    onError({ error }) {
      console.error('Error in tRPC handler:', error);
    },
  });

  // Copy any headers set by the procedure to the actual response
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  // Add any custom headers set in the context
  resHeaders.forEach((value, key) => {
    newResponse.headers.set(key, value);
  });

  return newResponse;
};

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}
