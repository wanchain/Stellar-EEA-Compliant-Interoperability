/*
 * Copyright (c) 2019 Wanchain. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict"

const BaseConvert = require('./evmBase.js');
const StellarConverter = require('./stellar_converter');

const convertDict = {
  'MATIC': new BaseConvert('MATIC'),
  'STELLAR': new StellarConverter('STELLAR')
}

exports.convertDict = convertDict;
