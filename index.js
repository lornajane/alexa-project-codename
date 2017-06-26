var bluebird = require('bluebird');
var generate = require('project-name-generator');
var redis = require('redis');

function main(args) {
  console.log(args);
  if(args.request && args.request.intent.name == "RecentCodenames") {
      if(args.redisURL) {
        bluebird.promisifyAll(redis.RedisClient.prototype);
        var client = redis.createClient(args.redisURL);
        return client.lrangeAsync(["codenames", 0, -1]).then(function (result) {
          console.log(result);
          return {
            "version": "1.0",
            "response" :{
              "shouldEndSession": true,
              "outputSpeech": {
                "type": "PlainText",
                "text": result.join(".  ")
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
        return client.lpushAsync(["codenames", random]).then(function (result) {
          return client.ltrimAsync(["codenames", 0, 2]);
        }).then(function(result) {
          return response;
        });
      } else {
        return response;
      }
  }

}

exports.main = main;
