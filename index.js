var bluebird = require('bluebird');
var generate = require('project-name-generator');
var redis = require('redis');

function main(args) {
  console.log(args);
  if(args.request && args.request.intent.name == "RecentCodenames") {
      if(args.redisURL) {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        var client = redis.createClient(args.redisURL);
        return client.getAsync(["codenames"]).then(function (result) {
          console.log(result);
          return {
            "version": "1.0",
            "response" :{
              "shouldEndSession": true,
              "outputSpeech": {
                "type": "PlainText",
                "text": result
              }
            }
          }
        });
      } else {
        return {
          "version": "1.0",
          "response" :{
            "shouldEndSession": true,
            "outputSpeech": {
              "type": "PlainText",
              "text": "I'm sorry, I don't remember"
            }
          }
        }
      }
  } else {
      // default to generating a new project name
      var pieces = generate().raw;
      var random = pieces.join(" ");
      console.log(random);
      var response = {
        "version": "1.0",
        "response" :{
          "shouldEndSession": true,
          "outputSpeech": {
            "type": "PlainText",
            "text": "project codename. " + random.replace(' ', ', ')
          }
        }
      }

      if(args.redisURL) {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        var client = redis.createClient(args.redisURL);
        return client.setAsync(["codenames", random]).then(function (result) {
          return response;
        });
      } else {
        return response;
      }
  }

}

exports.main = main;
