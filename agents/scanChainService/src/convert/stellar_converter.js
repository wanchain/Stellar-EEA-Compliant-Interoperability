/*
 * Copyright (c) 2019 Wanchain. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
"use strict"

const { xdr, scValToNative, ScInt} = require("@stellar/stellar-sdk");

const AbstractConvert = require("./convert_abstract.js");
const {InboundFunctionCallData, FunctionCallData, MessageData, EncodeInfo} = require("../utils/stellar/InboundCallDataClass");



module.exports = class Stellar extends AbstractConvert {

  constructor(chainType = null, log = console) {
    super(chainType, log);
  }

  ////////////////////////////////   section one //////////////////////////////////
  //=============================  top-level ( message bridge platform-level data )  ================================
  /**
   *
   * @param networkId
   * @param contractAddress
   * @param functionCallData: is an object that to be encoded, should be of format: {'method': xxx, 'messageData': {...}}
   */
  encodeFinalFunctionCallData(networkId, contractAddress, functionCallData) {
    let inbouCallData = new InboundFunctionCallData(functionCallData, networkId, contractAddress);
    let inboundCallDataBytes = inbouCallData.toXdrBytes();
    return inboundCallDataBytes;
  }

  decodeFinalFunctionCallData(finalFuncCallDataXdrBytes) {
    let finalFuncCallData = finalFuncCallDataXdrBytes;
    if(typeof finalFuncCallDataXdrBytes === "string") {
      finalFuncCallData = JSON.parse(finalFuncCallDataXdrBytes);
    }
    let finalFuncCallDataScVal = xdr.ScVal.fromXDR(finalFuncCallData);
    let finalFuncCallDataObj = scValToNative(finalFuncCallDataScVal);
    return finalFuncCallDataObj;
  }


  //=============================  second-level ================================
  encodeFunctionCallData(method, messageData) {
    let functionCallData = new FunctionCallData(method, messageData);
    return functionCallData.toXdrBytes();
  }

  decodeFunctionCallData(functionCallDataXdrBytes) {
    let funcCallData = functionCallDataXdrBytes;
    if(typeof functionCallDataXdrBytes === "string") {
      funcCallData = JSON.parse(funcCallData);
    }
    const functionCallDataObj = scValToNative(xdr.ScVal.fromXDR(functionCallDataXdrBytes));
    // const messageFunc = functionCallDataObj.messageFunc;
    // const messageDataBytes = functionCallDataObj.messageData;
    return functionCallDataObj
  }

  //=============================  lower-level (business level data)  ================================
  /**
   *
   * @param encodeMessage: message data object from others chains, such as EVM's Eth/Polygon
   *
   * @returns {*}
   */
  encodeMessageData(encodeMessage) {
    let messageData = new MessageData(
      encodeMessage.messageType,
      encodeMessage.nftContract,
      encodeMessage.nftId,
      encodeMessage.priceToken,
      encodeMessage.price,
      encodeMessage.recipent,
      encodeMessage.buyer,
    )
    return messageData.toXdrBytes();
  }


  decodeMessageData(messageDataXdrBytes) {
    if(typeof messageDataXdrBytes === "string") {
      messageDataXdrBytes = JSON.parse(messageDataXdrBytes);
    }
    const messageData = scValToNative(xdr.ScVal.fromXDR(messageDataXdrBytes));
    messageData.recipent = messageData.recipent.toString();
    messageData.priceToken = messageData.priceToken.toString();
    return messageData;
  }


  ////////////////////////////////   section two //////////////////////////////////

  //======================================== one-step encoding/decoding helper function that base on above functions

  recursiveEncodeFinalFunctionCallData(finalFunctionCallDataObject) {
    const {networkId, contractAddress, method,  messageData} = {...finalFunctionCallDataObject};

    // messageData is come from other chains, such as evm-like chains, and it's members of camel-case
    let _messageData = new MessageData(messageData.messageType,
      messageData.nftContract,
      messageData.nftId,
      messageData.priceToken,
      messageData.price,
      messageData.recipent,
      messageData.buyer);
    let messageDataByte = _messageData.toXdrBytes();

    let functionCallData = new FunctionCallData(method, messageDataByte)
    let functionCallDataByte = functionCallData.toXdrBytes();

    let inboundCallData = new InboundFunctionCallData(functionCallDataByte, networkId, contractAddress);
    let inboundCallDataBytes = inboundCallData.toXdrBytes();
    return inboundCallDataBytes;
  }

  recursiveDecodeFinalFunctionCallData(finalFuncCallDataXdrBytes) {
    let finalFuncCallData = finalFuncCallDataXdrBytes;
    if(typeof finalFuncCallDataXdrBytes === "string") {
      finalFuncCallData = JSON.parse(finalFuncCallDataXdrBytes);
    }
    let finalFuncCallDataObj = this.decodeFinalFunctionCallData(finalFuncCallData);
    let funcCallDataObj = this.decodeFunctionCallData(finalFuncCallDataObj.functionCallData);
    let messageDataObj = this.decodeMessageData(funcCallDataObj.messageData);

    return {
      "contractAddress": finalFuncCallDataObj.contractAddress, // original chain address
      "networkId": finalFuncCallDataObj.networkId,   // original chain address
      "method": funcCallDataObj.messageFunc,
      "messageData": messageDataObj,
    }
  }


  ////////////////////////////////   section three //////////////////////////////////

  getEncodeInfo(taskId, networkId, contractAddr, finalFunctionCallDataBytesStr) {
    let encodeInfo = new EncodeInfo(finalFunctionCallDataBytesStr, taskId, networkId, contractAddr);
    return encodeInfo.toXdrBytes();
  }

  getEncodeProof(secp256k1_signagures) {
    let ScVal = xdr.ScVal;
    let values = [];
    for(let i = 0; i < secp256k1_signagures.length; i++) {

      let data = secp256k1_signagures[i];
      let jsOrig = ScVal.scvMap([
        new xdr.ScMapEntry({
          key:ScVal.scvSymbol('recid'),
          val:new ScInt(data.recid).toU128(),
        }),
        new xdr.ScMapEntry({
          key: ScVal.scvSymbol('signature'),
          val: ScVal.scvBytes(data.signature)
        }),
      ]);

      values.push(jsOrig);
    }

    let totalJsOrig = ScVal.scvMap([
      new xdr.ScMapEntry({
        key: ScVal.scvSymbol('signatures'),
        val: ScVal.scvVec(values)
      })
    ])

    return totalJsOrig.toXDR();
  }

}