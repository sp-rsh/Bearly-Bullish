import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

rmSync(resolve('.next-bearly-bullish-dev'), { recursive: true, force: true, maxRetries: 2 });
