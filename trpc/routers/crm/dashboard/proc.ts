import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const CRMRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return `Hello ${ctx.session.user.email}`;
  }),
});
