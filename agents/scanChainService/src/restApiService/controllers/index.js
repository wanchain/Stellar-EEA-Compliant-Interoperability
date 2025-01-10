/*
 * Copyright (c) 2019 Wanchain. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
const { Router } = require('express');
const msgRouterControl = require('./msgRouterControl');
const NftRouterControl = require("./nftRouterControl");

module.exports = async function initControllers() {
  const router = Router();
  router.use("/", await msgRouterControl());
  router.use("/nft/", await NftRouterControl());
  return router;
};
