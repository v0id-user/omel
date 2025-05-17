import { auth } from '@/lib/betterauth/auth';
import { ratelimit } from '@/lib/ratelimt';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import { NextRequest, NextResponse } from 'next/server';

import superjson from 'superjson';

export type CreateContextOptions = {
  req?: NextRequest;
  resHeaders?: Headers;
};

export const createTRPCContext = async (opts: CreateContextOptions = {}) => {
  /**
   * @see: https://trpc.io/docs/server/context
   */

  // Get headers from request or from next/headers
  const requestHeaders = opts.req?.headers || (await headers());

  // Just grab the user from the session and return it
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    session,
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.resHeaders) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'لا يوجد رؤوس الاستجابة',
    });
  }

  return next({ ctx: { ...ctx, resHeaders: ctx.resHeaders } });
});

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'يجب أن تكون مسجلًا الدخول للوصول إلى هذه الموارد.',
    });
  }

  if (!ctx.session.session.activeOrganizationId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'لا يوجد مؤسسة مفعلة',
    });
  }

  // Ratelimit the user
  const { success: PassedRatelimit } = await ratelimit.limit(ctx.session.user.id);
  if (!PassedRatelimit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'لقد قمت بإرسال طلبات كثيرة جدًا. يرجى المحاولة مرة أخرى لاحقًا.',
    });
  }

  return next({ ctx: { ...ctx, session: ctx.session } });
});
