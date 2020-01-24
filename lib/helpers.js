/*
 * Helpers for various tasks
 *
 */

// Dependencies
const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const path = require('path');
const fs = require('fs');

// Container for all the helpers
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
  if(typeof(str) == 'string' && str.length > 0) {
    const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch(e) {
    return {};
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = (strLength) => {
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength) {
    // Define all the possible characters that could go into a string
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let str = '';
    for(i = 1; i <= strLength; i++) {
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random()*possibleCharacters.length));

      // Append this character to the final string
      str += randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

// A utility function for validating email format using regex
helpers.validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

// Place the order
helpers.placeOrder = (orderData, callback) => {
  const order = {
    amount : orderData.amount,
    currency : orderData.currency,
    source : orderData.source,
    description: orderData.description
  };
  // Construct the charge object
  const chargeString = querystring.stringify(order);
  const chargeDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.stripe.com',
    'method' : 'POST',
    'path' : '/v1/charges',
    'auth' : config.stripeSecretKey,
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(chargeString)
    }
  };
  const req = https.request(chargeDetails, (res) => {
    // Grab the status of the sent request
    const status = res.statusCode;
    // Process the response
    const decoder = new StringDecoder("utf-8");
    let buffer = '';
    let paymentData = {};

    res.on('data', (data) => {
      buffer += data;
    });

    res.on('end', () => {
      buffer += decoder.end();
      paymentData = helpers.parseJsonToObject(buffer);
      // Callback successfully if the request went through
      if(status == 200 || status == 201) {
        callback(false, paymentData);
      } else {
        callback('Returned with status code: '+status);
      }
    });
  });

  // Bind the error event so it doesn't get thrown
  req.on('error', (e) => {
    callback(e);
  });
  // Add the payment
  req.write(chargeString);
  // End the request
  req.end();
};

// Email the user a receipt via Mailgun
helpers.sendReceiptViaMailgun = (data, callback) => {
  const orderTime = Date(data.timeOfOrder);
  let message = '------- Segal\'s Famous Pizzeria -------- \n\n';
  message += `Order ID: ${data.id} \n`;
  message += `Order Date: ${orderTime.toString()} \n\n`;
  message += `Order Details:\n`;
  data.items.forEach((pizza) => {
    message += pizza.amount+' '+pizza.name+'\n';
  });
  message += `\nTotal Price: ${data.totalPrice} ${data.currency}\n\n`;
  message += `------- Thank you and hope to see you soon --------`;
  const sentData = {
    from : data.from,
    to : data.to,
    subject : data.subject,
    text : message
  };
  // Stringify the request data
  const stringData = querystring.stringify(sentData);

  // Construct the request details
  const requestDetails = {
    'protocol' : 'https:',
    'hostname' : 'api.mailgun.net',
    'method' : 'POST',
    'path' : `/v3/${config.mailgun.domain}/messages`,
    'auth' : `api:${config.mailgun.api_key}`,
    'headers' : {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Content-Length' : Buffer.byteLength(stringData)
    }
  };

  // Instantiate the request object
  const req = https.request(requestDetails, (res) => {
    // Grab the status of the sent request
    const status = res.statusCode;
    // Callback successfully if the request went through
    if(status == 200 || status == 201) {
      callback(false);
    } else {
      callback('Status code returned was '+status);
    }
  });
  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    callback(e);
  });
  // Add the payload
  req.write(stringData);
  // End the request
  req.end();
};

// Get a string content of a template
helpers.getTemplate = (templateName, data, callback) => {
  templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false;
  data = typeof(data) == 'object' && data !== null ? data : {};
  if(templateName) {
    const templatesDir = path.join(__dirname,'/../templates/');
    fs.readFile(templatesDir+templateName+'.html','utf8', (err, str) => {
      if(!err && str && str.length > 0) {
        // Do interpolation on the string
        const finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback('No template could be found');
      }
    });
  } else {
    callback('A valid template name was not specified');
  }
};

// Add the universal header and footer to a string, and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = (str, data, callback) => {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};
  // Get the header
  helpers.getTemplate('_header', data, (err, headerString) => {
    if(!err && headerString) {
      // Get the footer
      helpers.getTemplate('_footer', data, (err, footerString) => {
        if(!err && footerString) {
          // Add them all together
          const fullString = headerString+str+footerString;
          callback(false, fullString);
        } else {
          callback('Could not find the footer template')
        }
      });
    } else {
      callback('Could not find the header template');
    }
  });
};

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = (str, data) => {
  str = typeof(str) == 'string' && str.length > 0 ? str : '';
  data = typeof(data) == 'object' && data !== null ? data : {};

  // Add the template globals to the data object, prepending their key name with "global"
  for(let keyName in config.templateGlobals) {
    if(config.templateGlobals.hasOwnProperty(keyName)) {
      data['global.'+keyName] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for(let key in data) {
    if(data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
      let replace = data[key];
      let find = '{'+key+'}';
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of a static (public) asset
helpers.getStaticAsset = (fileName, callback) => {
  fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
  if(fileName) {
    const publicDir = path.join(__dirname, '/../public/');
    fs.readFile(publicDir+fileName, (err, data) => {
      if(!err && data) {
        callback(false, data);
      } else {
        callback('No file could be found');
      }
    });
  } else {
    callback('A valid file name was not specified');
  }
};

module.exports = helpers;
