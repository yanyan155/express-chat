const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'test';
// Use connect method to connect to the server
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  if(err){
    throw err;

  } else {
    const db = client.db(dbName);
    const collection = db.collection('documents');
    // Insert some documents
    /*collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      if(err){
        throw err;
      } else {
        console.log(`${result.insertedCount}`);
      }
    });*/

    collection.find({}).toArray(function(err, docs) {
      if(err){
        throw err;
      } else {
        console.log(docs);
      }
    });
    /*async function getCount() {
      let count = await collection.countDocuments({});
      console.log(count);
    }
    getCount();*/
    collection.countDocuments({}, (err, result) => {
      if(err) throw err;
      console.log(result);
    })
  }
  client.close();
});