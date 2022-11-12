const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./map1.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the map database.');
});

module.exports = {
  updateMapConfig: function (id, data) {
    db.serialize(() => {
      db.each(`UPDATE configs SET id='{id}', data='{data}' WHERE id='{id}'`, (err, row) => {
        if(err){
          throw err;
        }
        console.log('updated: ' + {id});
      });
    });
    return 'testa';
  },
  getAllConfig: function (tableName) {

  },
  selectAll: function(tableName) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
    });
  },
  closeDatabase: function() {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  }
};