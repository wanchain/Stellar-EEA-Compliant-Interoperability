/*
 * Copyright (c) 2019 Wanchain. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
const { createHash } = require('crypto');

module.exports = env => {
  const hash = createHash('md5');
  hash.update(JSON.stringify(env));

  return hash.digest('hex');
};
