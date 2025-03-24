import 'server-only';
import { betterAuth } from "better-auth";
import { Pool } from "pg";
 
export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    emailAndPassword: {  
        enabled: true
    },
    rateLimit: {
        enabled: true,
        limit: 10,
        window: 10000,
        storage: 'database',
        database: new Pool({
            connectionString: process.env.DATABASE_URL
        })
    },
    
});