function main(args) {
  var generate = require('project-name-generator');
  var pieces = generate().raw;

  var random = pieces.join(", ");
  console.log(random);

  var response = {
    "version": "1.0",
    "response" :{
      "shouldEndSession": true,
      "outputSpeech": {
        "type": "PlainText", 
        "text": "project codename. " + random
      }
    }
  }

  console.log(response);

  return(response);
}

exports.main = main;
