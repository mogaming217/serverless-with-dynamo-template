'use strict';

let AWS = require("aws-sdk");
let dynamo = new AWS.DynamoDB.DocumentClient();

let TABLE_NAME = "test-table";

let response = {
  statusCode: 200,
  headers: {},
  body: ""
};

module.exports.hello = (event, context, callback) => {
  console.log(JSON.stringify(event));

  let method = event.httpMethod;
  switch (method) {
    case "GET":
      let uid = event.queryStringParameters.uid;
      let param = {
        TableName: TABLE_NAME,
        Key: {
          uid: uid
        }
      };
      dynamo.get(param, function(err, data){
        if(err){
          response.statusCode = 400;
          response.body = "error";
          callback(null, response);
        }else{
          response.statusCode = 200;
          response.body = JSON.stringify(data.Item);
          callback(null, response);
        }
      });
      break;
    case "POST":
      let body = JSON.parse(event.body);
      if(body.uid){
        let param = {
          TableName: TABLE_NAME,
          Item: body
        };
        dynamo.put(param, function(err, data){
          if(err){
            response.statusCode = 400;
            response.body = "error";
            callback(null, response);
          }else{
            response.statusCode = 200;
            response.body = "ok";
            callback(null, response);
          }
        });
      }else{
        response.statusCode = 400;
        response.body = "need uid";
        callback(null, response);
      }
      break;
    default:
      response.statusCode = 400;
      response.body = "error";
      callback(null, response);
      break;
  }
};
