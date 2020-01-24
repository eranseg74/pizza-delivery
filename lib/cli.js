/*
 * CLI-Related Tasks
 *
 */

// Dependencies
const readLine = require('readline');
const util = require('util');
const debug = util.debuglog('cli');
const events = require('events');
class _events extends events{};
const e = new _events();
const _data = require('./data');
const helpers = require('./helpers');
const menu = require('./menu');

// Instantiate the CLI module object
const cli = {};

// Input handlers
e.on('man', (str) => {
  cli.Responders.help();
});

e.on('help', (str) => {
  cli.Responders.help();
});

e.on('exit', (str) => {
  cli.Responders.exit();
});

e.on('menu', (str) => {
  cli.Responders.menu();
});

e.on('list orders', (str) => {
  cli.Responders.listOrders();
});

e.on('more order info', (str) => {
  cli.Responders.moreOrderInfo(str);
});

e.on('list users', (str) => {
  cli.Responders.listUsers();
});

e.on('more user info', (str) => {
  cli.Responders.moreUserInfo(str);
});

// Responders object
cli.Responders = {};

// Help / Man
cli.Responders.help = () => {
  const commands = {
    'man' : 'Show help page',
    'help' : 'Alias to the "man" command',
    'exit' : 'Kill the CLI (and the rest of the application)',
    'menu' : 'Show all the items in the pizza menu',
    'list orders' : 'Show a list of all the orders (of all users)',
    'more order info --{orderId}' : 'Show details of a specific order',
    'list users' : 'Show a list of all the registered (undeleted) users in the system',
    'more user info --{userId}' : 'Show details of a specific user'
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively
  for(let key in commands) {
    if(commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = '\x1b[33m'+key+'\x1b[0m';
      const padding = 60 - line.length;
      for(let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }
  cli.verticalSpace(1);
  // End with another horizontalLine
  cli.horizontalLine();
};

// Create a vertical space
cli.verticalSpace = (lines) => {
  lines = typeof(lines) == 'number' && lines > 0 ? lines : 1;
  for(i = 0; i < lines; i++) {
    console.log('');
  }
};

// Create a horizontal line across the screen
cli.horizontalLine = () => {
  // Get the available screen size
  const width = process.stdout.columns;
  let line = '';
  for(i = 0; i < width; i++) {
    line += '-';
  }
  console.log(line);
};

cli.centered = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : '';
  // Get the available screen width
  const width = process.stdout.columns;
  // Calculate the left padding there should be
  const leftPadding = Math.floor((width - str.length) / 2);
  // Put in left padded spaces before the string itself
  let line = '';
  for(i = 0; i < leftPadding; i++) {
    line += ' ';
  }
  line += str;
  console.log(line);
};

// Exit
cli.Responders.exit = () => {
  process.exit(0);
};

cli.Responders.menu = () => {
  console.dir(menu, {'colors': true});
};

cli.Responders.listOrders = () => {
  _data.list('orders', (err, orderIds) => {
    if(!err && orderIds && orderIds.length > 0) {
      cli.verticalSpace();
      orderIds.forEach((orderId) => {
        _data.read('orders', orderId, (err, orderData) => {
          // Check if the order was submitted in the last 24 hours. If so, write it to the console
          if(Date.now() - orderData.timeOfOrder < 1000 * 60 * 60 * 24) {
            let line = 'ID: '+'\x1b[33m'+orderData.id+'\x1b[0m'+' Description: '+'\x1b[33m'+orderData.description+'\x1b[0m';
            console.log(line);
            cli.verticalSpace();
          }
        });
      });
    }
  });
};

cli.Responders.moreOrderInfo = (str) => {
  // Get the ID from the string
  const arr = str.split('--');
  const orderId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(orderId) {
    // Lookup the order
    _data.read('orders', orderId, (err, orderData) => {
      if(!err && orderData) {
        // Format the date and time
        orderData.timeOfOrder = (new Date(orderData.timeOfOrder)).toString();
        // Print the JSON with text highlighting
        cli.verticalSpace();
        console.dir(orderData, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
};

// List Users
cli.Responders.listUsers = () => {
  _data.list('users', (err, userIds) => {
    if(!err && userIds && userIds.length > 0) {
      cli.verticalSpace();
      userIds.forEach((userId) => {
        _data.read('users', userId, (err, userData) => {
          if(!err && userData) {
            if(Date.now() - userData.lastSignedIn < 1000 * 60) {
              let line = 'Name: '+userData.firstName+' '+userData.lastName+' Email: '+userData.email+' Number of orders: ';
              const numberOfOrders = typeof(userData.orders) == 'object' && userData.checks instanceof Array && userData.orders.length > 0 ? userData.orders.length : 0;
              line += numberOfOrders;
              console.log(line);
              cli.verticalSpace();
            }
          }
        });
      });
    }
  });
};

// More User Info
cli.Responders.moreUserInfo = (str) => {
  // Get the ID from the string
  const arr = str.split('--');
  const userId = typeof(arr[1]) == 'string' && arr[1].trim().length > 0 ? arr[1].trim() : false;
  if(userId) {
    // Lookup the user
    _data.read('users', userId, (err, userData) => {
      if(!err && userData) {
        // Remove the hashed password
        delete userData.hashedPassword;
        // Print the JSON with text highlighting
        cli.verticalSpace();
        userData.lastSignedIn = new Date(userData.lastSignedIn).toString();
        console.dir(userData, {'colors': true});
        cli.verticalSpace();
      }
    });
  }
};

cli.processInput = (str) => {
  str = typeof(str) == 'string' && str.trim().length > 0 ? str.trim() : false;
  // Only process the input if the user actually wrote something. Otherwise ignore it.
  if(str) {
    // Codify the unique strings that identify the unique questions allowed to be asked
    const uniqueInputs = [
      'man',
      'help',
      'exit',
      'menu',
      'list orders',
      'more order info',
      'list users',
      'more user info',
    ];
    // Go through the possible inputs, emit an event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some((input) => {
      if(str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;
        // Emit an event matching the unique input, and include the full string given by the user
        e.emit(input, str);
        return true;
      }
    });
    // If no match is found, tell the user to try again
    if(!matchFound) {
      console.log("Sorry, try again");
    }
  }
};

// Init script
cli.init = () => {
  // Send the start message to the console, in dark blue
  console.log('\x1b[34m%s\x1b[0m', "The CLI is running");
  // Start the interface
  const _interface = readLine.createInterface({
    input : process.stdin,
    output : process.stdout,
    prompt : '>'
  });
  // Create an initial prompt
  _interface.prompt();
  // Handle each line of input separately
  _interface.on('line', (str) => {
    // Send to the input processer
    cli.processInput(str);
    // Re-initialize the prompt afterwords
    _interface.prompt();
  });
  // If the user stops the CLI, kill the associated process
  _interface.on('close', () => {
    process.exit(0);
  });
};
// Export the module
module.exports = cli;
