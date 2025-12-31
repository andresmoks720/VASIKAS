#!/usr/bin/env node

import { restoreEaip } from './eaip-pull';

// Run the restore function
restoreEaip().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});