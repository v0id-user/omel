import { auth } from '@/lib/betterauth/auth';
import { publicRatelimit, ratelimit } from '@/lib/ratelimt';
import { getMemberRole } from '@/features/crm/shared/server/ownership';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

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
    clientIp: getClientIp(requestHeaders),
    req: opts.req,
    resHeaders: opts.resHeaders,
  };
};

function getClientIp(requestHeaders: Headers) {
  const forwardedFor = requestHeaders.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || requestHeaders.get('x-real-ip') || 'unknown';
}

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
  errorFormatter({ shape, error }) {
    // Unexpected server errors can carry SQL and driver details; keep those in the logs only.
    if (process.env.NODE_ENV === 'production' && error.code === 'INTERNAL_SERVER_ERROR') {
      return { ...shape, message: 'حدث خطأ غير متوقع' };
    }
    return shape;
  },
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

  const { success: passedRatelimit } = await publicRatelimit.limit(ctx.clientIp);
  if (!passedRatelimit) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'لقد قمت بإرسال طلبات كثيرة جدًا. يرجى المحاولة مرة أخرى لاحقًا.',
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

  const organizationId = ctx.session.session.activeOrganizationId;
  if (!organizationId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'لا يوجد مؤسسة مفعلة',
    });
  }

  // The session keeps its active organization after a member is removed, so check membership on every call.
  const memberRole = await getMemberRole(organizationId, ctx.session.user.id);
  if (!memberRole) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'لست عضوًا في هذه المؤسسة',
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

  return next({
    ctx: { ...ctx, session: ctx.session, organizationId, memberRole },
  });
});
