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
  getAllConfig: function () {
    db.serialize(() => {  
      db.each(`SELECT id, data FROM configs`, (err, row) => {
        if (err){
          throw err;
        }
        console.log(row.id + " " + row.data);
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