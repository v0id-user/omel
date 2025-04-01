import { bigint, numeric, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

//TODO: Convert all id to text and use CUIDs
//TODO: Details can be null, but we need to make sure that the data is not lost
