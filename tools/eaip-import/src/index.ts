#!/usr/bin/env node

import { pullLatestEaip } from './eaip-pull';

// Run the main function
pullLatestEaip().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});