/* const fs = require("fs");
var yauzl = require("yauzl");

yauzl.open(LOCALFILE.input, {lazyEntries: true}, function(err:any, zipfile:any) {
  if (err) throw err;
  zipfile.readEntry();
  zipfile.on("entry", function(entry:any) {
    if (/\/$/.test(entry.fileName)) {
      // Directory file names end with '/'.
      // Note that entries for directories themselves are optional.
      // An entry's fileName implicitly requires its parent directories to exist.
      zipfile.readEntry();
    } else {
      // file entry
      zipfile.openReadStream(entry, function(err:any, readStream:any) {
        if (err) throw err;
        readStream.on("end", function() {
          zipfile.readEntry();
        });
        readStream.pipe(fs.createWriteStream(LOCALFILE.output));
      });
    }
  });
}); */