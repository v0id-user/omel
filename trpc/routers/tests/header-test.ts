import { baseProcedure, protectedProcedure } from '@/trpc/init';
import { createTRPCRouter } from '@/trpc/init';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const headerTestRouter = createTRPCRouter({
  // Test setting a cookie
  setCookie: baseProcedure
    .input(
      z.object({
        name: z.string().default('testCookie'),
        value: z.string().default('cookieValue'),
        maxAge: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.resHeaders) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Response headers not available',
        });
      }

      // Create the cookie value
      let cookie = `${input.name}=${input.value}; Path=/`;
      if (input.maxAge) {
        cookie += `; Max-Age=${input.maxAge}`;
      }

      // Set the cookie header
      ctx.resHeaders.append('Set-Cookie', cookie);

      return {
        success: true,
        message: `Cookie ${input.name} set successfully`,
      };
    }),

  // Test setting a custom header
  setHeader: baseProcedure
    .input(
      z.object({
        name: z.string(),
        value: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      if (!ctx.resHeaders) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Response headers not available',
        });
      }

      // Set the custom header
      ctx.resHeaders.set(input.name, input.value);

      return {
        success: true,
        message: `Header ${input.name} set successfully`,
      };
    }),

  // Test reading headers from the request
  getRequestHeaders: baseProcedure
    .input(
      z.object({
        headerName: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!ctx.req) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Request object not available',
        });
      }

      // If a specific header is requested, return that one
      if (input.headerName) {
        return {
          [input.headerName]: ctx.req.headers.get(input.headerName),
        };
      }

      // Otherwise, return all headers as an object
      const headers: Record<string, string> = {};
      ctx.req.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return headers;
    }),

  // Test reading cookies from the request
  getRequestCookies: baseProcedure.query(({ ctx }) => {
    if (!ctx.req) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Request object not available',
      });
    }

    // Return all cookies
    return Object.fromEntries(ctx.req.cookies);
  }),
});
