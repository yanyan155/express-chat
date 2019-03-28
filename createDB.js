const mongoose = require('./libs/mongoose');

async function testDb() {
  await dropDb();
  let User = await createIndexes();
  let save = await saveUsers(User);
  closeConnection();
}

async function saveUsers (User) {

  let user1 = new User ({name: 'tonki', password: 'tonki'});
  let user2 = new User ({name: 'tonki', password: 'tolsty'});
  let user3 = new User ({name: 'admin', password: 'admin'});

  await Promise.all([saveUser(user1), saveUser(user2), saveUser(user3)]);
}
function saveUser(user) {

  return new Promise(function(resolve, reject) {

    user.save((err, product) => {
      if (err) {
        reject(err);
        closeConnection();
      }else if(product) {
        console.log(product);
        resolve(product);
      };
    })
  });
}

function closeConnection () {
  mongoose.connection.close();
}

function dropDb () {
  mongoose.connection.db.dropDatabase();
}

function createIndexes () {
  const User = require('./models/user'); // if we reqiure early dropDb delete all indexes
  User.ensureIndexes();
  return User;
}

mongoose.connection.on('open', () => {
  testDb();
});