/*
 * Request handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');
const menu = require('./menu');
const fs = require('fs');

//Container for the handlers
const handlers = {};
/*
 * HTML Handlers
 */

// Index handler
handlers.index = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Segal\'s Pizzeria - An unforgetable taste',
      'head.description' : 'We ofer the best pizza in town!',
      'body.class' : 'index'
    };

    // Read in a template as a string
    helpers.getTemplate('index', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create Account
handlers.accountCreate = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup is easy and only takes a few seconds.',
      'body.class' : 'accountCreate'
    };

    // Read in a template as a string
    helpers.getTemplate('accountCreate', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create new Session
handlers.sessionCreate = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Login to your Account',
      'head.description' : 'Please enrter your email and password to access your account.',
      'body.class' : 'sessionCreate'
    };

    // Read in a template as a string
    helpers.getTemplate('sessionCreate', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Session has been deleted
handlers.sessionDeleted = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted'
    };

    // Read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Edit you account
handlers.accountEdit = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit'
    };

    // Read in a template as a string
    helpers.getTemplate('accountEdit', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Account has been deleted
handlers.accountDeleted = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Account Deleted',
      'head.description' : 'Your account has been deleted.',
      'body.class' : 'accountDeleted'
    };

    // Read in a template as a string
    helpers.getTemplate('accountDeleted', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Dashboard (view all checks)
handlers.ordersList = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Dashboard',
      'body.class' : 'ordersList'
    };
    // Read in a template as a string
    helpers.getTemplate('ordersList', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Create a new check
handlers.ordersCreate = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Create an Order',
      'body.class' : 'ordersCreate'
    };

    // Read in a template as a string
    helpers.getTemplate('ordersCreate', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Submit an order
handlers.ordersSubmit = (data, callback) => {
  // Reject any requests that isn't a GET
  if(data.method == 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title' : 'Submit your order and enjoy a tasty pizza',
      'body.class' : 'ordersSubmit'
    };

    // Read in a template as a string
    helpers.getTemplate('ordersSubmit', templateData, (err, str) => {
      if(!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if(!err && str) {
            // Return that page as HTML
            callback(200, str, 'html');
          } else {
            callback(500, undefined, 'html');
          }
        });
      } else {
        callback(500, undefined, 'html');
      }
    });
  } else {
    callback(405, undefined, 'html');
  }
};

// Favicon
handlers.favicon = (data, callback) => {
  // Reject any method that isn't a GET
  if(data.method == 'get') {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', (err, data) => {
      if(!err && data) {
        // Callback the data
        callback(200, data, 'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = (data, callback) => {
  // Reject any method that isn't a GET
  if(data.method == 'get') {
    // Get the filename being requested
    const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();
    if(trimmedAssetName.length > 0) {
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if(!err && data) {
          // Determine the content type (default to plain text)
          let contentType = 'plain';
          if(trimmedAssetName.indexOf('.css') > -1) {
            contentType = 'css';
          }
          if(trimmedAssetName.indexOf('.png') > -1) {
            contentType = 'png';
          }
          if(trimmedAssetName.indexOf('.jpg') > -1) {
            contentType = 'jpg';
          }
          if(trimmedAssetName.indexOf('.ico') > -1) {
            contentType = 'favicon';
          }
          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};

/*
 * JSON API Handlers
 */

// USERS
handlers.users = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the users submethods
handlers._users = {};

// Users - post
// Required data : firstName, lastName, password, email, address, tosAgreement
// Optional data : none
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 && helpers.validateEmail(data.payload.email.trim().toLowerCase()) ? data.payload.email.trim().toLowerCase() : false;
  const street = typeof(data.payload.street) == 'string' && data.payload.street.trim().length > 0 ? data.payload.street.trim() : false;
  const city = typeof(data.payload.city) == 'string' && data.payload.city.trim().length > 0 ? data.payload.city.trim() : false;
  const country = typeof(data.payload.country) == 'string' && data.payload.country.trim().length > 0 ? data.payload.country.trim() : false;
  const postalCode = typeof(data.payload.postalCode) == 'string' && data.payload.postalCode.trim().length == 5 ? data.payload.postalCode : false;
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
  if(firstName && lastName && password && email && street && city && country && postalCode && tosAgreement) {
    // Make sure that the user doesn't already exist
    _data.read('users', email, (err, data) => {
      if(err) {
        // Hash the password using 'crypto'
        const hashedPassword = helpers.hash(password);

        // Create the user object
        if(hashedPassword) {
          const userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'hashedPassword' : hashedPassword,
            'email' : email,
            'address' : {
              'street' : street,
              'city' : city,
              'country' : country,
              'postalCode' : postalCode
            },
            'lastSignedIn' : Date.now(),
            'tosAgreement' : true // Otherwise the user's object will not be created
          };
          // Store the user
          _data.create('users', email, userObject, (err) => {
            if(!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500, {'Error' : 'Could not hash the user\'s password'});
        }
      } else {
        // User already exists
        callback(400, {'Error' : 'A user with that phone number already exists!'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// Users - get
// Required data : email, token
// Optional data : none
// Only let an authenticated user access their object. Don't let them access anyone elses
handlers._users.get = (data, callback) => {
  // Check that the email is valid
  const email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 && helpers.validateEmail(data.queryStringObject.email.trim().toLowerCase()) ? data.queryStringObject.email.trim() : false;
  if(email) {
    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid for the email
    handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
      if(tokenIsValid) {
        // Look up the user
        _data.read('users', email, (err, data) => {
          if(!err && data) {
            // Remove the hashed password from the user object before returning it to the requester
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404); // 404 - NOT FOUND
          }
        });
      } else {
        callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// Users - put
// Required data : email
// Optional data : firstName, lastName, password, address (at least one must be specified)
// Only let an authenticated user update their own object. Don't let them update anyone elses
handlers._users.put = (data, callback) => {
  // Check for the required field
  const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 && helpers.validateEmail(data.payload.email.trim().toLowerCase()) ? data.payload.email.trim().toLowerCase() : false;

  // Check for the optional fields
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const street = typeof(data.payload.street) == 'string' && data.payload.street.trim().length > 0 ? data.payload.street.trim() : false;
  const city = typeof(data.payload.city) == 'string' && data.payload.city.trim().length > 0 ? data.payload.city.trim() : false;
  const country = typeof(data.payload.country) == 'string' && data.payload.country.trim().length > 0 ? data.payload.country.trim() : false;
  const postalCode = typeof(data.payload.postalCode) == 'number' && data.payload.postalCode.toString().trim().length == 5 ? data.payload.postalCode : false;

  // Error if email is invalid
  if(email) {
    // Error if nothing is sent to update
    if(firstName || lastName || password || street || city || country || postalCode) {
      // Get the token from the headers
      const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
      // Verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
        if(tokenIsValid) {
          // Lookup the user
          _data.read('users', email, (err, userData) => {
            if(!err && userData) {
              const address = {
                'street' : street,
                'city' : city,
                'country' : country,
                'postalCode' : postalCode
              };
              // Update the fields necessary
              if(firstName) userData.firstName = firstName;
              if(lastName) userData.lastName = lastName;
              if(password) userData.hashedPassword = helpers.hash(password);
              if(address) userData.address = address;
              // Store the new updates
              _data.update('users', email, userData, (err) => {
                if(!err) {
                  callback(200);
                } else {
                  console.log(err);
                  // 500 - means that the error is on our server and not on the user's request -> internal error
                  callback(500, {'Error' : 'Could not update the user'});
                }
              });
            } else {
              callback(400, {'Error' : 'The specified user does not exist'});
            }
          });
        } else {
          callback(403, {'Error' : 'Missing required token in header, or token is invalid'});
        }
      });
    } else {
      callback(400, {'Error' : 'Missing fields to update'});
    }
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// Users - delete
// Required data : email
// Optional data : none
// Only let an authinticated user delete their own object. Don't let them delete anyone elses
// Cleanup (delete) any other data files associated with this user
handlers._users.delete = (data, callback) => {
  // Check that the email is valid
  const email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 && helpers.validateEmail(data.queryStringObject.email.trim().toLowerCase()) ? data.queryStringObject.email.trim() : false;
  if(email) {
    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
      if(tokenIsValid) {
        // Lookup the user
        _data.read('users', email, (err, userData) => {
          if(!err && userData) {
            // Delete all user's orders
            if(userData.orders) {
              userData.orders.forEach((item) => {
                _data.delete('orders', item, (err) => {
                  if(err) {
                    callback(500, {'Error' : 'Could not delete user\'s orders'});
                  }
                });
              });
            }
            _data.delete('tokens', token, (err) => {
              if(!err) {
                _data.delete('users', email, (err) => {
                  if(!err) {
                    callback(200);
                  } else {
                    callback(500, {'Error' : 'Could not delete the specified user'});
                  }
                });
              } else {
                callback(500, {'Error' : 'Could not delete the user\'s token'});
              }
            });
          } else {
            callback(400, {'Error' : 'Could not find the specified user'});
          }
        });
      } else {
        callback(403, {'Error' : 'Missing required token in headers, or token is invalid'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// TOKENS
handlers.tokens = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for all the token methods
handlers._tokens = {};

// Tokens - post -> this action occurs on user's login
// Required data : email, password
// Optional data : none
handlers._tokens.post = (data, callback) => {
  // Check for the required fields
  const email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 && helpers.validateEmail(data.payload.email.trim().toLowerCase()) ? data.payload.email.trim().toLowerCase() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  if(email && password) {
    // Lookup the user that matches that phone number
    _data.read('users', email, (err, userData) => {
      if(!err && userData) {
        // Hash the sent password and compare it to the password stored in the user data
        const hashedPassword = helpers.hash(password);
        if(hashedPassword == userData.hashedPassword) {
          // If valid, create a new token with a random name. Set expiration data 1 hour in the future
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() * 1000 * 60 * 60;
          const tokenObject = {
            'email' : email,
            'id' : tokenId,
            'expires' : expires
          };

          // Store the token
          _data.create('tokens', tokenId, tokenObject, (err) => {
            if(!err) {
              // Update the lastSignedIn time on the user data
              userData.lastSignedIn = Date.now();
              _data.update('users', email, userData, (err) => {
                if(!err) {
                  callback(200, tokenObject);
                } else {
                  callback(500, {'Error' : 'Could not update the LastSignedIn field on the user data'});
                }
              });
            } else {
              callback(500, {'Error' : 'Could not create the new token'});
            }
          });
        } else {
          callback(400, {'Error' : 'Password did not match the specified user\'s stored password'});
        }
      } else {
        callback(400, {'Error' : 'Could not find the specified user'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// Tokens - get
// Required data : id
// Optional data : none
handlers._tokens.get = (data, callback) => {
  const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id) {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
      if(!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404); // 404 - NOT FOUND
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// Tokens - put
// Required data : id, extend
// Optional data : none
handlers._tokens.put = (data, callback) => {
  const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id : false;
  const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;
  if(id && extend) {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
      if(!err && tokenData) {
        // Check to make sure that the token isn't already expired
        if(tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update('tokens', id, tokenData, (err) => {
            if(!err) {
              callback(200);
            } else {
              console.log(err);
              // 500 - means that the error is on our server and not on the user's request -> internal error
              callback(500, {'Error' : 'Could not update the token\'s expiration'});
            }
          });
        } else {
          callback(400, {'Error' : 'The token has already expired, and cannot be extended'});
        }
      } else {
        callback(400, {'Error' : 'Specified token does not exist'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required field(s) or field(s) are invalid'});
  }
};

// Tokens - delete -> this action occurs on user's logout
// Required data : id
// Optional data : none
handlers._tokens.delete = (data, callback) => {
  // Check that the id is valid
  const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
  if(id) {
    // Lookup the user
    _data.read('tokens', id, (err, tokenData) => {
      if(!err && tokenData) {
        _data.delete('tokens', id, (err) => {
          if(!err) {
            callback(200);
          } else {
            callback(500, {'Error' : 'Could not delete the specified token'});
          }
        });
      } else {
        callback(400, {'Error' : 'Could not find the specified token'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

handlers._tokens.verifyToken = (id, email, callback) => {
  // Lookup the token
  _data.read('tokens', id, (err, tokenData) => {
    if(!err && tokenData) {
      // Check that the token is for the given user and has not expired
      if(tokenData.email == email && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// MENU
handlers.menus = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'put', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._menus[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the menus method
handlers._menus = {};

// Menu - get
// Required data : email, token
// Optional data : none
handlers._menus.get = (data, callback) => {
  // Validate email and token. Both values from the header
  const email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 && helpers.validateEmail(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false;
  const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
  if(email && token) {
    // Verify that the token is valid
    handlers._tokens.verifyToken(token, email, (tokenIsValid) => {
      if(tokenIsValid) {
        // Get the Menu
        callback(200, menu);
      } else {
        callback(403, {'Error' : 'Token is invalid'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};

// A utility method for loading a menu
handlers._menus.loadMenu = (menu) => {
  // Check that a menu does not already exists
  _data.read('menus', 'pizzaMenu', (err) => {
    if(err) {
      // Create the menu accourding to the menu object
      _data.create('menus', 'pizzaMenu', menu, (err) => {
        if(err) {
          console.log('Error loading the menu');
        }
      });
    }
  });
};

// CARTS - Represents the shopping carts. A user can have several shopping carts which are one step before the order.
// A user can create new carts, add items to an existing carts, get details on these carts or delete carts.
handlers.carts = (data, callback) => {
  const acceptableMethods = ['post', 'get', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._carts[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the carts methods
handlers._carts = {};

// Carts - post -> Method for adding a new item to a cart. If the cart does not exsits, a new one is created
// Required data : an array of items and the amount of each item
handlers._carts.post = (data, callback) => {
  // Validate that the data is an array of items and has at least one element
  data.payload = typeof(data.payload) == 'object' && data.payload instanceof Array && data.payload.length > 0 ? data.payload : false;
  if(data.payload) {
    // Check that the user have provided a token and that the token is valid
    const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
    // Map the items in the menu to an array containing strings of the items name
    const itemsInMenu = menu.map(pizza => pizza.name);
    // Lookup the user by reading the token
    _data.read('tokens', token, (err, tokenData) => {
      if(!err && tokenData) {
        const email = tokenData.email;
        // Lookup the user data
        _data.read('users', email, (err, userData) => {
          if(!err && userData) {
            // Check if the user has a cart
            if(!userData.cartId) {
              // Create new cart id
              const cartId = helpers.createRandomString(15);
              // Calculate the totla price of the new cart using the menu
              let totalPrice = 0;
              for(let i = 0; i < data.payload.length; i++) {
                totalPrice += menu[itemsInMenu.indexOf(data.payload[i].name)].price * data.payload[i].amount;
              }
              // Save the object in an array
              const newCart = {
                'cartId' : cartId,
                'totalCartPrice' : totalPrice,
                'items' : data.payload
              };
              _data.create('carts', cartId, newCart, (err) => {
                if(!err) {
                  // Add the cart id to the user's object
                  userData.cartId = cartId;
                  // Save the user's data
                  _data.update('users', email, userData, (err) => {
                    if(!err) {
                      callback(200);
                    } else {
                      callback(500, {'Error' : 'Could not update the user data'});
                    }
                  });
                } else {
                  callback(500, {'Error' : 'Could not create the new cart'});
                }
              });
            } else {
              // Update the user's cart
              for(let i = 0; i < data.payload.length; i++) {
                // Validate input
                const itemName = typeof(data.payload[i].name) == 'string' && data.payload[i].name .trim().length > 0 ? data.payload[i].name : false;
                const amount = typeof(data.payload[i].amount) == 'number' && data.payload[i].amount > 0 ? data.payload[i].amount : false;
                // Check that the item is in the menu
                if(itemName && amount && itemsInMenu.indexOf(itemName) > -1) {
                  // Collect requested data for updating or creaing the cart
                  const price = menu[itemsInMenu.indexOf(itemName)].price;
                  const totalPrice = price * amount;
                  // Create the cart object
                  const itemToCart = {
                    'name' : itemName,
                    'price' : price,
                    'amount' : amount,
                    'totalPrice' : totalPrice
                  };
                  // Get cart data
                  _data.read('carts', userData.cartId, (err, cartData) => {
                    if(!err && cartData) {
                      // Update the total value of the cart
                      cartData.totalCartPrice += totalPrice;
                      // Check if the item already exists
                      const currentItem = cartData.items.filter(item => item.name == itemName);
                      if(currentItem.length > 0) {
                        // Add item to the existing item
                        cartData.items.forEach((pizza) => {
                          if(pizza.name == itemName) {
                            pizza.amount += amount;
                            pizza.totalPrice += amount * price;
                          }
                        });
                        _data.update('carts', userData.cartId, cartData, (err) => {
                          if(!err) {
                            callback(200);
                          } else {
                            callback(500, {'Error' : 'Could not update the item in the cart'});
                          }
                        });
                      } else {
                        // Add new item to cart
                        cartData.items.push(itemToCart);
                        _data.update('carts', userData.cartId, cartData, (err) => {
                          if(!err) {
                            callback(200);
                          } else {
                            callback(500, {'Error' : 'Could not update the cart'});
                          }
                        });
                      }
                    }
                  });
                }
              }
            }
          } else {
            callback(405, {'Error' : 'No such user'});
          }
        });
      } else {
        callback(403, {'Error' : 'Invalid token'});
      }
    });
  } else {
    callback(400, {'Error' : 'Invalid data'});
  }
}

// Carts - get
// Required data : id
// Optional data : none
handlers._carts.get = (data, callback) => {
  const cartId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 15 ? data.queryStringObject.id.trim() : false;
  if(cartId) {
    // Lookup for the shopping cart
    _data.read('carts', cartId, (err, cartData) => {
      if(!err && cartData) {
        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
        // Lookup the user
        _data.read('tokens', token, (err, tokenData) => {
          if(!err && tokenData) {
            // Validate the token
            handlers._tokens.verifyToken(token, tokenData.email, (tokenIsValid) => {
              if(tokenIsValid) {
                callback(200, cartData);
              } else {
                callback(400, {'Error' : 'Token is not valid'});
              }
            });
          } else {
            callback(404, {'Error' : 'Could not find the token'});
          }
        });
      } else {
        callback(404, {'Error' : 'Could not find the cart'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields or data is invalid'});
  }
};

// Carts - get
// Required data : id
// Optional data : none
handlers._carts.delete = (data, callback) => {
  const cartId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 15 ? data.queryStringObject.id.trim() : false;
  if(cartId) {
    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
    // Get the token data in order to validate the user
    _data.read('tokens', token, (err, tokenData) => {
      if(!err && tokenData) {
        handlers._tokens.verifyToken(token, tokenData.email, (tokenIsValid) => {
          if(tokenIsValid) {
            // Delete the cart using a utility function
            handlers._carts.deleteCart(cartId, tokenData.email, (err) => {
              if(!err) {
                callback(200);
              } else {
                callback(500, err);
              }
            });
          } else {
            callback(403, {'Error' : 'Invalid token'});
          }
        });
      } else {
        callback(404, {'Error' : 'Could not find the token'});
      }
    });
  } else {
    callback(400, {'Error' : 'Missing required fields or data is invalid'});
  }
};

// A utility function for deleting a cart. This is in order to prevent having the same code in the _carts.delete and in the _orders.post functions.
handlers._carts.deleteCart = (cartId, userEmail, callback) => {
  _data.delete('carts', cartId, (err) => {
    if(!err) {
      // Remove the cart id from the user object
      _data.read('users', userEmail, (err, userData) => {
        if(!err && userData) {
          delete userData.cartId;
          _data.update('users', userEmail, userData, (err) => {
            if(!err) {
              callback(false);
            } else {
              callback('Error : Could not update the user\'s object');
            }
          });
        } else {
          callback('Error : Could not remove the cart from the users object');
        }
      });
    } else {
      callback('Error : Could not delete the cart');
    }
  });
};

handlers.orders = (data, callback) => {
  const acceptableMethods = ['post', 'get'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._orders[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for the orders method
handlers._orders = {};

// Orders - post
// Required data : cart id
// Optional data : none
handlers._orders.post = (data, callback) => {
  const cartId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 15 ? data.queryStringObject.id.trim() : false;
  if(cartId) {
    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
    if(token) {
      // Get token info
      _data.read('tokens', token, (err, tokenData) => {
        if(!err && tokenData) {
          // Get the user data with the user email in the token data
          const email = tokenData.email;
          _data.read('users', email, (err, userData) => {
            if(!err && userData) {
              // Validate the cart id
              if(cartId == userData.cartId) {
                // Lookup the shopping cart
                _data.read('carts', cartId, (err, cartData) => {
                  if(!err && cartData) {
                    // Construct the order object for payment
                    const payload = {
                      amount : cartData.totalCartPrice*100, // Stripe expects price in cents
                      currency : config.currency,
                      source : config.stripeToken, // Testing token for Stripe
                      description : 'Payment for pizza cart ID: '+cartId
                    };
                    helpers.placeOrder(payload, (err) => {
                      if(!err) {
                        // Create an ID for the new order
                        const orderId = helpers.createRandomString(12);
                        // Constract the order object
                        const orderDetails = {
                          'id' : orderId,
                          'description' : payload.description,
                          'timeOfOrder' : Date.now(),
                          'items' : cartData.items,
                          'totalPrice' : cartData.totalCartPrice,
                          'currency' : config.currency,
                          'fullName' : userData.firstName+' '+userData.lastName
                        };
                        // Save the order data
                        _data.create('orders', orderId, orderDetails, (err) => {
                          if(!err) {
                            // Check if the user has already orders and update the userData on the new order
                            userData.orders = (userData.orders) ?
                            userData.orders : [];
                            userData.orders.push(orderId);
                            _data.update('users', email, userData, (err) => {
                              if(!err) {
                                // Construct an orderData object for the mail receipient
                                const orderData = {
                                  'id' : orderId,
                                  'from' : config.mailgun.from,
                                  'to' : email,
                                  'subject' : `Order Confirmation - Order Id: ${orderId}`,
                                  'timeOfOrder' : orderDetails.timeOfOrder,
                                  'totalPrice' : orderDetails.totalPrice,
                                  'currency' : config.currency,
                                  'items' : cartData.items,
                                };
                                // If order was successfully logged, delete the cart
                                handlers._carts.deleteCart(cartId, email, (err) => {
                                  if(!err) {
                                    // Send the user a confirmation mail via Mailgun
                                    helpers.sendReceiptViaMailgun(orderData, (err) => {
                                      if(!err) {
                                        callback(200);
                                      } else {
                                        callback(405, {'Error' : `Failed to send the receipt mail to ${orderDetails.fullName}`});
                                      }
                                    });
                                  } else {
                                    callback(500, {'Error' : 'Could not delete the cart from the user\'s data'});
                                  }
                                });
                              } else {
                                callback(500, {'Error' : 'Failed to add the order to the user data'});
                              }
                            });
                          } else {
                            callback(500, {'Error' : 'Error saving the order details'});
                          }
                        });
                        console.log("Payment was successfully processed");
                      }
                    });
                  } else {
                    callback(404, {'Error' : 'Could not find the cart'});
                  }
                });
              } else {
                callback(403, {'Error' : 'The given cart id does not math the user\'s cart id'});
              }
            } else {
              callback(403, {'Error' : 'The given token did not match the user\'s token'})
            }
          });
        } else {
          callback(403, {'Error' : 'Token does not exists'});
        }
      });
    } else {
      callback(400, {'Error' : 'Missing or Invalid token'});
    }
  } else {
    callback(400, {'Error' : 'Missing required fields or Cart ID is invalid'});
  }
};

// Orders - get
// Required data : id, token
// Optional data : none
handlers._orders.get = (data, callback) => {
  const orderId = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 12 ? data.queryStringObject.id.trim() : false;
  if(orderId) {
    // Get the token from the headers
    const token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == 20 ? data.headers.token.trim() : false;
    if(token) {
      // Extract the user's email from the token object
      _data.read('tokens', token, (err, tokenData) => {
        if(!err && tokenData) {
          // Validate that the order belongs to the specified user
          _data.read('users', tokenData.email, (err, userData) => {
            if(!err && userData && userData.orders.indexOf(orderId) > -1) {
              _data.read('orders', orderId, (err, orderData) => {
                if(!err && orderData) {
                  callback(200, orderData);
                } else {
                  callback(404, {'Error' : 'Could not find the specified order'});
                }
              });
            } else {
              callback(404, {'Error' : 'Failed to get user data or order specified does not exists'});
            }
          });
        } else {
          callback(404, {'Error' : 'Could not find the specified token'});
        }
      });
    } else {
      callback(400, {'Error' : 'Missing required token'});
    }
  } else {
    callback(400, {'Error' : 'Missing required order id or invalid order id'});
  }
};

// Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

// NOT FOUND handler
handlers.notFound = (data, callback) => {
  callback(404);
};

module.exports = handlers;
