import { z } from 'zod';

const VisitsSchema = z.object({ count: z.number(), name: z.string() });

type Visits = z.infer<typeof VisitsSchema>;

export type { Visits };

export { VisitsSchema };
