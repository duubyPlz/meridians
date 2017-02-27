import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  var fs = Npm.require('fs');
  console.log("current: " + process.cwd());

  // 1.csv
  var fileNames = [
    '1.csv',
    '2.csv',
    '3.csv',
    '4.csv',
    '5.csv',
    '6.csv',
    '7.csv',
    '8.csv',
    '10.csv',
    '11.csv',
    '12.csv',
    '13.csv',
    '14.csv',
    '18.csv',
    '20.csv',
  ];
  // https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
  // for (var i=0, len=fileNames.length; i<len; i++) {
  //   console.log(fileNames[i]);
  //   var contents = fs.readFileSync(process.cwd() + '/../../../../../public/csv/' + fileNames[i], 'utf8');
  // }

  var contents = fs.readFileSync(process.cwd() + '/../../../../../public/csv/1.csv', 'utf8');

  if (contents != null) {
    csvObject = Papa.parse(contents);
  } else {
    console.warn('contents from fs is null');
  }
  if (csvObject != null) {
    // console.log(fileNames[i] + ' papa parsed ok');
    console.log('1.csv papa parsed ok');
    // processPapaObject(csvObject.data, fileNames[i]);
    processPapaObject(csvObject.data, '1.csv');
  } else {
    console.warn('csv object is null');
  }

  function processPapaObject(data, fileName) {
    // 0. Create collection
    var collectionNames = {
       '1.csv' : '手太陰肺經',
       '2.csv' : '手陽明大腸經',
       '3.csv' : '手厥陰心包經',
       '4.csv' : '手少陽三焦經',
       '5.csv' : '手少陰心經',
       '6.csv' : '手太陽小腸經',
       '7.csv' : '足太陰脾經',
       '8.csv' : '足陽明胃經',
      '10.csv' : '足厥陰肝經',
      '11.csv' : '足少陽膽經a',
      '12.csv' : '足少陽膽經b',
      '13.csv' : '足少陰腎經',
      '14.csv' : '足太陽膀胱經',
      '18.csv' : '督脈',
      '20.csv' : '任脈',
    };
    console.log('collection name for ' + fileName + ' is ' + collectionNames[fileName]);
    // ?<collection_object>? = new Mongo.Collection('?<collection_name>?');

    console.log('size: ' + data.length);

    // title
    var names = data[0];

    // contents
    for (var i=1; i<data.length; i++) {
      var line = data[i];
      console.log("line: " + line);

      // for each title column, insert the row values
      // `line` and `names` should be the same length
      var hash = {};
      for (var j=0; j<line.length; j++) {
        hash[names[j]] = line[j];
      }
      console.log(hash);
      console.log('hash: \n');
      // ?<collection_object>?.insert(hash);
    }
  }
});
