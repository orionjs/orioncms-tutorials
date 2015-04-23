var fs = require('fs');

var file = fs.readFileSync('./tutorials.json', 'utf8');

describe('tutorials.json', function(){
  it('should have valid json structure', function(){
    JSON.parse(file);
  })
  it('all files exists', function() {
    var json = JSON.parse(file);

    if (!Array.isArray(json)) {
      throw Error('tutorials.json is not an array');
    }

    for (var i = 0; i < json.length; i++) {
      var page = json[i];
      var fileContents = fs.readFileSync('./tutorials/' + page.file, 'utf8');
      if (!fileContents) {
        throw Error('file "' + page.file + '" is empty');
      }
    }
  })
})