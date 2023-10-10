import * as fs from 'fs';

import { Report } from '../../services/index.js';

async function parseOne(path: string) {
  const file = fs.readFileSync(
    path,
    {
      encoding: 'utf8',
      flag: 'r',
    },
  );

  return Report.parseOne(file);
}

export default parseOne;
