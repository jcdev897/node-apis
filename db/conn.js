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
    let result = '';
    db.serialize(() => {  
      db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err){
          throw err;
        }
        result = JSON.stringify(rows);
        return result;
      });
    });
    return result;
  },
  selectAll: function(tableName) {
    db.serialize(function () {
      const stmt = db.prepare(`SELECT * FROM ${tableName}`);
      stmt.run();
      stmt.finalize();
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