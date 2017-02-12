function main(args) {
  var generate = require('project-name-generator');
  var random = generate().spaced;

  console.log(random);

  return({payload: "OK"});
}

exports.main = main;
