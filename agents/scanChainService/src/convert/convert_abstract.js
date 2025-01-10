/*
 * Copyright (c) 2019 Wanchain. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict"

module.exports = class AbstractConvert{
  constructor(chainType = null, log = console) {
    this.logger = log;
    this.chainType = chainType;
    this.setConvertContract();
  }

  setConvertContract(abi, action) {
    throw new Error("NOT IMPLEMENTED");
  }

  getMessageAbi() {
    throw new Error("NOT IMPLEMENTED");
  }

  encodeMessageData(...encodeMessage) {
    throw new Error("NOT IMPLEMENTED");
  }

  decodeMessageData(messageData) {
    throw new Error("NOT IMPLEMENTED");
  }

  encodeFunctionCallData(messageData) {
    throw new Error("NOT IMPLEMENTED");
  }

  decodeFunctionCallData(functionCallData) {
    throw new Error("NOT IMPLEMENTED");
  }

  encodeFinalFunctionCallData(networkId, contractAddress, functionCallData) {
    throw new Error("NOT IMPLEMENTED");
  }

  decodeFinalFunctionCallData(finallyFunctionCallData) {
    throw new Error("NOT IMPLEMENTED");
  }
}