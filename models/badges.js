// Import the ORM to implement functions that will interact with the database
var orm = require('../config/orm.js');
// Create the badge object
var badges = {
        // Select all badge table entries
        selectAll: function(b) {
          orm.selectAll('badges', function(res) {
            b(res);
          });
        },
      
        // The variables cols and vals are arrays
        insertOne: function(cols, vals, b) {
          orm.insertOne('badges', cols, vals, function(res) {
            b(res);
          });
        },
      
        // The objColVals is an object specifying columns as object keys with associated values
        updateOne: function(objColVals, condition, b) {
          orm.updateOne('badges', objColVals, condition, function(res) {
            b(res);
          });
        }
      };
      
      // Export the database functions for the controller (authcontroller.js).
      module.exports = badges;