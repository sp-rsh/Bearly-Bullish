import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

// OneDrive can leave invalid junction metadata in Next's generated output on Windows.
// This deliberately removes only this project's disposable build directory.
rmSync(resolve('.next-bearly-bullish'), { recursive: true, force: true, maxRetries: 2 });
