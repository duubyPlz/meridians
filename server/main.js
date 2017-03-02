import { Meteor } from 'meteor/meteor';

// Meteor.startup(() => {
// });
if (Meteor.isServer) {
  var fs = Npm.require('fs');

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

  var numberToCollection = {
    '1' : Collection1,
    '2' : Collection2,
    '3' : Collection3,
    '4' : Collection4,
    '5' : Collection5,
    '6' : Collection6,
    '7' : Collection7,
    '8' : Collection8,
    '10' : Collection10,
    '11' : Collection11,
    '12' : Collection12,
    '13' : Collection13,
    '14' : Collection14,
    '18' : Collection18,
    '20' : Collection20,
  }

  var numberToMeridian = {
    '1' : '手太陰肺經',
    '2' : '手陽明大腸經',
    '3' : '手厥陰心包經',
    '4' : '手少陽三焦經',
    '5' : '手少陰心經',
    '6' : '手太陽小腸經',
    '7' : '足太陰脾經',
    '8' : '足陽明胃經',
    '10' : '足厥陰肝經',
    '11' : '足少陽膽經a',
    '12' : '足少陽膽經b',
    '13' : '足少陰腎經',
    '14' : '足太陽膀胱經',
    '18' : '督脈',
    '20' : '任脈',
  }

  // https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
  for (var i=0; i<fileNames.length; i++) {
    var currentName = fileNames[i];
    var fileNumber = currentName.replace('.csv', '');
    var collection = numberToCollection[parseInt(fileNumber)];
    console.log('\nInitialising collection ' + fileNumber + '...');

    // only populate collections if they're empty
    if (collection.find({}).count() === 0) {
      console.log(' > Collection' + fileNumber + ' EMPTY');

      // papa parse!
      var contents = fs.readFileSync(process.cwd() + '/../../../../../public/csv/' + currentName, 'utf8');
      if (contents != null) {
        csvObject = Papa.parse(contents);
      } else {
        console.warn('contents from fs is null');
      }
      if (csvObject != null) {
        console.log(currentName + ' papa parsed ok');

        // populate
        populateCollection(csvObject.data, fileNumber);
      } else {
        console.warn('csv object is null');
      }
    } else {
      console.log(' > Collection' + fileNumber + " NOT EMPTY: " + collection.find({}).count());
    }
  }

  function populateCollection(data, fileNumber) {
    var currentCollection = numberToCollection[parseInt(fileNumber)];

    console.log('size: ' + data.length);

    // column titles
    var names = data[0];

    // current collection's meridian name
    var meridianName = numberToMeridian[fileNumber];

    // contents, for each line
    for (var i=1; i<data.length; i++) {
      var line = data[i];
      console.log("line: " + line);

      // insert name-values, for each title column
      // `line` and `names` should be the same length
      var hash = {};
      for (var j=0; j<line.length; j++) {
        hash[names[j]] = line[j];
      }
      hash['經絡'] = meridianName; // insert this in every entry
      console.log('hash: \n');
      console.log(hash);

      currentCollection.insert(hash);
    }
  }

  Meteor.publish('collection1_front', function() {
    return Collection1.find();
  });
  Meteor.publish('collection2_front', function() {
    return Collection2.find();
  });
  Meteor.publish('collection3_front', function() {
    return Collection3.find();
  });
  Meteor.publish('collection4_front', function() {
    return Collection4.find();
  });
  Meteor.publish('collection5_front', function() {
    return Collection5.find();
  });
  Meteor.publish('collection6_front', function() {
    return Collection6.find();
  });
  Meteor.publish('collection7_front', function() {
    return Collection7.find();
  });
  Meteor.publish('collection8_front', function() {
    return Collection8.find();
  });
  Meteor.publish('collection10_front', function() {
    return Collection10.find();
  });
  Meteor.publish('collection11_front', function() {
    return Collection11.find();
  });
  Meteor.publish('collection12_front', function() {
    return Collection12.find();
  });
  Meteor.publish('collection13_front', function() {
    return Collection13.find();
  });
  Meteor.publish('collection14_front', function() {
    return Collection14.find();
  });
  Meteor.publish('collection18_front', function() {
    return Collection18.find();
  });
  Meteor.publish('collection20_front', function() {
    return Collection20.find();
  });
}
