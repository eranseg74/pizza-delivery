/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
const app = {};

// Config
app.config = {
  'sessionToken' : false
};

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = (headers,path,method,queryStringObject,payload,callback) => {

  // Set defaults
  headers = typeof(headers) == 'object' && headers !== null ? headers : {};
  path = typeof(path) == 'string' ? path : '/';
  method = typeof(method) == 'string' && ['POST','GET','PUT','DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET';
  queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {};
  payload = typeof(payload) == 'object' && payload !== null ? payload : {};
  callback = typeof(callback) == 'function' ? callback : false;

  // For each query string parameter sent, add it to the path
  let requestUrl = path+'?';
  let counter = 0;
  for(let queryKey in queryStringObject){
     if(queryStringObject.hasOwnProperty(queryKey)){
       counter++;
       // If at least one query string parameter has already been added, preprend new ones with an ampersand
       if(counter > 1){
         requestUrl+='&';
       }
       // Add the key and value
       requestUrl+=queryKey+'='+queryStringObject[queryKey];
     }
  }

  // Form the http request as a JSON type
  const xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/json");

  // For each header sent, add it to the request
  for(let headerKey in headers){
     if(headers.hasOwnProperty(headerKey)){
       xhr.setRequestHeader(headerKey, headers[headerKey]);
     }
  }

  // If there is a current session token set, add that as a header
  if(app.config.sessionToken){
    xhr.setRequestHeader("token", app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = () => {
      if(xhr.readyState == XMLHttpRequest.DONE) {
        const statusCode = xhr.status;
        const responseReturned = xhr.responseText;
        // Callback if requested
        if(callback){
          try{
            const parsedResponse = JSON.parse(responseReturned);
            callback(statusCode,parsedResponse);
          } catch(e){
            callback(statusCode,false);
          }
        }
      }
  }
  // Send the payload as JSON
  const payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
};

// Bind the logout button
app.bindLogoutButton = () => {
  document.getElementById("logoutButton").addEventListener("click", (e) => {
    // Stop it from redirecting anywhere
    e.preventDefault();
    // Log the user out
    app.logUserOut();
  });
};

// Log the user out then redirect them
app.logUserOut = (redirectUser) => {
  // Set redirectUser to default to true
  redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true;
  // Get the current token id
  const tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false;
  // Send the current token to the tokens endpoint to delete it
  const queryStringObject = {
    'id' : tokenId
  };
  app.client.request(undefined,'api/tokens', 'DELETE', queryStringObject, undefined, (statusCode, responsePayload) => {
    // Set the app.config token as false
    app.setSessionToken(false);
    // Clear all items from local storage
    localStorage.clear();
    // Send the user to the logged out page
    if(redirectUser){
      window.location = '/session/deleted';
    }
  });
};

// Bind the forms
app.bindForms = () => {
  if(document.querySelector("form")){
    const allForms = document.querySelectorAll("form");
    for(let i = 0; i < allForms.length; i++){
        allForms[i].addEventListener("submit", (e) => {
        // Stop it from submitting
        e.preventDefault();
        const formId = allForms[i].id;
        const path = allForms[i].action;
        let method = allForms[i].method.toUpperCase();
        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#"+formId+" .formError").style.display = 'none';
        // Hide the success message (if it's currently shown due to a previous error)
        if(document.querySelector("#"+formId+" .formSuccess")){
          document.querySelector("#"+formId+" .formSuccess").style.display = 'none';
        }
        // Turn the inputs into a payload
        let payload = {};
        let cartItemsName = []; // for the cart creation
        let payloadsArray = []; // for the cart creation
        if(allForms[i].id == "ordersCreate") {
          const cartItems = document.querySelectorAll("figcaption");
          for(let i = 0; i < cartItems.length; i++) {
            cartItemsName.push(cartItems[i].innerHTML);
          }
        }
        elements = allForms[i].elements;
        for(let j = 0; j < elements.length; j++){
          if(elements[j].type !== 'submit'){
            // Determine class of element and set value accordingly
            const classOfElement = typeof(elements[j].classList.value) == 'string' && elements[j].classList.value.length > 0 ? elements[j].classList.value : '';
            const valueOfElement = elements[j].type == 'checkbox' && classOfElement.indexOf('multiselect') == -1 ? elements[j].checked : classOfElement.indexOf('intval') == -1 ? elements[j].value : parseInt(elements[j].value);
            const elementIsChecked = elements[j].checked;
            // Override the method of the form if the input's name is _method
            let nameOfElement = elements[j].name;
            if(nameOfElement == '_method'){
              method = valueOfElement;
            } else {
              // Create an payload field named "method" if the elements name is actually httpmethod
              if(nameOfElement == 'httpmethod'){
                nameOfElement = 'method';
              }
              // Create an payload field named "id" if the elements name is actually uid
              if(nameOfElement == 'uid'){
                nameOfElement = 'id';
              }
              // If the element has the class "multiselect" add its value(s) as array elements
              if(classOfElement.indexOf('multiselect') > -1){
                if(elementIsChecked){
                  payload[nameOfElement] = typeof(payload[nameOfElement]) == 'object' && payload[nameOfElement] instanceof Array ? payload[nameOfElement] : [];
                  payload[nameOfElement].push(valueOfElement);
                }
              } else {
                payload[nameOfElement] = valueOfElement;
                const newObj = {};
                if(allForms[i].id == "ordersCreate") {
                  newObj.name = cartItemsName[j];
                  newObj.amount = parseInt(valueOfElement);
                }
                if(valueOfElement > 0) {
                    payloadsArray.push(newObj);
                }
              }
            }
          }
        }
        // If the method is DELETE, the payload should be a queryStringObject instead
        let queryStringObject = method == 'DELETE' ? payload : {};
        queryStringObject = allForms[i].id == "cartDelete" || allForms[i].id == "ordersSubmit" ?  JSON.parse(localStorage.getItem('cartId')) : queryStringObject;
        // Call the API
        const newPayload = allForms[i].id == "ordersCreate" ? payloadsArray : payload;
        app.client.request(undefined,path,method,queryStringObject,newPayload,(statusCode,responsePayload) => {
          // Display an error on the form if needed
          if(statusCode !== 200){
            if(statusCode == 403){
              // log the user out
              app.logUserOut();
            } else {
              // Try to get the error from the api, or set a default error message
              const error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again';
              // Set the formError field with the error text
              document.querySelector("#"+formId+" .formError").innerHTML = error;
              // Show (unhide) the form error field on the form
              document.querySelector("#"+formId+" .formError").style.display = 'block';
            }
          } else {
            // If successful, send to form response processor
            app.formResponseProcessor(formId,newPayload,responsePayload);
          }
        });
      });
    }
  }
};

// Form response processor
app.formResponseProcessor = (formId,requestPayload,responsePayload) => {
  const functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if(formId == 'accountCreate') {
    // Take the email and password, and use it to log the user in
    const newPayload = {
      'email' : requestPayload.email,
      'password' : requestPayload.password
    };
    app.client.request(undefined,'api/tokens', 'POST', undefined, newPayload, (newStatusCode, newResponsePayload) => {
      // Display an error on the form if needed
      if(newStatusCode !== 200){
        // Set the formError field with the error text
        document.querySelector("#"+formId+" .formError").innerHTML = 'Sorry, an error has occured. Please try again.';
        // Show (unhide) the form error field on the form
        document.querySelector("#"+formId+" .formError").style.display = 'block';
      } else {
        // If successful, set the token and redirect the user
        app.setSessionToken(newResponsePayload);
        window.location = '/orders/all';
      }
    });
  }
  // If login was successful, set the token in localstorage and redirect the user
  if(formId == 'sessionCreate'){
    app.setSessionToken(responsePayload);
    window.location = '/orders/all';
  }
  // If forms saved successfully and they have success messages, show them
  const formsWithSuccessMessages = ['accountEdit1', 'accountEdit2','ordersSubmit'];
  if(formsWithSuccessMessages.indexOf(formId) > -1){
    document.querySelector("#"+formId+" .formSuccess").style.display = 'block';
  }
  // If the user just deleted their account, redirect them to the account-delete page
  if(formId == 'accountEdit3'){
    app.logUserOut(false);
    window.location = '/account/deleted';
  }
  // If the user just created a new cart successfully, redirect to the order-submit page
  if(formId == 'ordersCreate'){
    window.location = '/orders/submit';
  }
  // If the user just submitted an order successfully, redirect them to the dashboard
  if(formId == 'ordersSubmit'){
    app.deleteUserCart();
    window.location = '/orders/all';
  }
  // If the user just submitted an order successfully, redirect them to the dashboard
  if(formId == 'cartDelete'){
    app.deleteUserCart();
    window.location = '/orders/all';
  }
};

app.deleteUserCart = () => {
  // Get the email from the current token, or log the user out if none is there
  const email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email){
    // Fetch the user data
    const queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
      if(statusCode == 200) {
        // Check if the user has a cart. If so - delete it
        if(responsePayload.cartId) {
          app.client.request(undefined,'api/carts', 'DELETE', {'id' : responsePayload.cartId}, undefined, (statusCode, responsePayload) => {
            if(statusCode == 200) {

            } else {
              console.log("Could not delete the cart!");
            }
          });
        }
      } else {
        console.log("Could not get the user's data!");
      }
    });
  } else {
    console.log("Could not get the email from the token!");
  }
}

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = () => {
  const tokenString = localStorage.getItem('token');
  if(typeof(tokenString) == 'string'){
    try{
      const token = JSON.parse(tokenString);
      app.config.sessionToken = token;
      if(typeof(token) == 'object'){
        app.setLoggedInClass(true);
      } else {
        app.setLoggedInClass(false);
      }
    }catch(e){
      app.config.sessionToken = false;
      app.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = (add) => {
  const target = document.querySelector("body");
  if(add){
    target.classList.add('loggedIn');
  } else {
    target.classList.remove('loggedIn');
  }
};

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = (token) => {
  app.config.sessionToken = token;
  const tokenString = JSON.stringify(token);
  localStorage.setItem('token',tokenString);
  if(typeof(token) == 'object'){
    app.setLoggedInClass(true);
  } else {
    app.setLoggedInClass(false);
  }
};

// A utility function to store an object in the local storage
app.setObjectInLocalStorage = (objKey, obj) => {
  // Validate the inputs
  obj = typeof(obj) == 'object' && obj !== null ? obj : false;
  objKey = typeof(objKey) == 'string' && objKey.length > 0 ? objKey : false;
  if(objKey && obj) {
    // Store the object in the local storage
    const objString = JSON.stringify(obj);
    localStorage.setItem(objKey, objString);
  }
};

// A utility function to get an object from,the local storage
app.getObjFromLocaleStorage = (objName) => {
  const objString = localStorage.getItem(objName);
  if(typeof(objString) == 'string'){
    try{
      const obj = JSON.parse(objString);
    }catch(e){
      objString = '';
    }
  }
  return obj;
};

// Renew the token
app.renewToken = (callback) => {
  const currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken){
    // Update the token with a new expiration
    const payload = {
      'id' : currentToken.id,
      'extend' : true
    };
    app.client.request(undefined,'api/tokens','PUT',undefined,payload,(statusCode,responsePayload) => {
      // Display an error on the form if needed
      if(statusCode == 200){
        // Get the new token details
        const queryStringObject = {'id' : currentToken.id};
        app.client.request(undefined,'api/tokens', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
          // Display an error on the form if needed
          if(statusCode == 200){
            app.setSessionToken(responsePayload);
            callback(false);
          } else {
            app.setSessionToken(false);
            callback(true);
          }
        });
      } else {
        app.setSessionToken(false);
        callback(true);
      }
    });
  } else {
    app.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
app.loadDataOnPage = () => {
  // Get the current page from the body class
  const bodyClasses = document.querySelector("body").classList;
  const primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false;
  // Logic for account settings page
  if(primaryClass == 'accountEdit'){
    app.loadAccountEditPage();
  }
  // Logic for dashboard page
  if(primaryClass == 'ordersList'){
    app.loadOrdersListPage();
  }
  // Logic for order create details page
  if(primaryClass == 'ordersCreate'){
    app.loadOrdersCreatePage();
  }
  // Logic for order submission details page
  if(primaryClass == 'ordersSubmit'){
    app.loadOrdersSubmitPage();
  }
};

// Load the account edit page specifically
app.loadAccountEditPage = () => {
  // Get the email from the current token, or log the user out if none is there
  const email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email){
    // Fetch the user data
    const queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
      if(statusCode == 200){
        // Put the data into the forms as values where needed
        document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName;
        document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName;
        document.querySelector("#accountEdit1 .displayEmailInput").value = responsePayload.email;
        // Put the hidden email field into both forms
        const hiddenEmailInputs = document.querySelectorAll("input.hiddenEmailInput");
        for(let i = 0; i < hiddenEmailInputs.length; i++){
            hiddenEmailInputs[i].value = responsePayload.email;
        }
      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

// Load the dashboard page specifically
app.loadOrdersListPage = () => {
  // Get the email from the current token, or log the user out if none is there
  const email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email){
    // Fetch the user data
    const queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
      if(statusCode == 200){
        // Determine how many orders the user has
        const allOrders = typeof(responsePayload.orders) == 'object' && responsePayload.orders instanceof Array && responsePayload.orders.length > 0 ? responsePayload.orders : [];
        if(allOrders.length > 0){
          // Show each created order as a new row in the table
          allOrders.forEach((orderId) => {
            // Get the data for the order
            const newQueryStringObject = {
              'id' : orderId
            };
            app.client.request(undefined,'api/orders', 'GET', newQueryStringObject, undefined, (statusCode, responsePayload) => {
              if(statusCode == 200){
                const orderData = responsePayload;
                // Make the order data into a table row
                const table = document.getElementById("ordersListTable");
                const tr = table.insertRow(-1);
                tr.classList.add('orderRow');
                const td0 = tr.insertCell(0);
                const td1 = tr.insertCell(1);
                const td2 = tr.insertCell(2);
                const td3 = tr.insertCell(3);
                td0.innerHTML = responsePayload.id;
                td1.innerHTML = Date(responsePayload.timeOfOrder);
                let itemsStr = '';
                responsePayload.items.forEach((item) => {
                  itemsStr += item.amount+" "+item.name+", "
                });
                td2.innerHTML = itemsStr.slice(0, itemsStr.length-2);
                td3.innerHTML = responsePayload.totalPrice+"$";
              } else {
                console.log("Error trying to load order ID: ",orderId);
              }
            });
          });
          if(allOrders.length < 5){
            // Show the createCheck CTA
            document.getElementById("createOrderCTA").style.display = 'block';
          }
        } else {
          // Show 'you have no orders' message
          document.getElementById("noOrdersMessage").style.display = 'table-row';
          // Show the createOrder CTA
          document.getElementById("createOrderCTA").style.display = 'block';
        }
      } else {
        // If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
        app.logUserOut();
      }
    });
  } else {
    app.logUserOut();
  }
};

// Load the menu details on the order's create page specifically
app.loadOrdersCreatePage = () => {
  // Get the menu data from 'pizzaMenu' json file
  const email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false;
  if(email) {
    // Update the token with a new expiration
    const queryStringObject = {
      'email' : email
    };
    app.client.request(undefined,'api/menus', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
      if(statusCode == 200){
        const table = document.getElementById("menuTable");
        let totalOrderCost = 0;
        for(let i = 0; i < responsePayload.length; i++) {
          const tr = table.insertRow(i+1);
          tr.classList.add('menuRow');
          const figure = document.createElement("figure");
          const img = document.createElement("img");
          img.setAttribute("src","public/images/"+responsePayload[i].name+".jpg");
          img.setAttribute("alt",responsePayload[i].name);
          const figCap = document.createElement("figcaption");
          figCap.innerHTML = responsePayload[i].name;
          figure.appendChild(img);
          figure.appendChild(figCap);
          const td0 = tr.insertCell(0);
          td0.appendChild(figure);
          const td1 = tr.insertCell(1);
          td1.setAttribute("class", "price");
          td1.innerHTML = responsePayload[i].price+"$";
          const td2 = tr.insertCell(2);
          const td3 = tr.insertCell(3);
          td3.setAttribute("class", "price calc");
          td3.innerHTML = 0+"$";
          const amount = document.createElement("input");
          amount.setAttribute("type", "number");
          amount.setAttribute("name", "amount");
          amount.setAttribute("value", 0);
          amount.onchange = () => {
            const totalCost = amount.value * responsePayload[i].price;
            td3.innerHTML = totalCost+"$";
            const costsArr = document.querySelectorAll('.calc');
            totalOrderCost = 0;
            costsArr.forEach((item) => {
              totalOrderCost += parseInt(item.innerHTML.slice(0, item.innerHTML.length-1));
            });
            document.getElementById("totalOrderPrice").innerHTML = "Total Order Price: "+totalOrderCost+"$";
          };
          td2.appendChild(amount);
        }
      } else {
        // If the request comes back as something other than 200, redirect back to dashboard
        window.location = '/';
      }
    });
  } else {
    // If the token is not valid then log the user out
    app.logUserOut();
  }
};

// Loads the summery of the user's cart just before submitting the order
app.loadOrdersSubmitPage = () => {
  // Get the cart data from 'api/carts'
  const currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false;
  if(currentToken) {
    let queryStringObject = {
      'email' : currentToken.email
    };
    // Extract the cart id from the user's data
    app.client.request(undefined,'api/users', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
      if(statusCode == 200) {
        const cartId = responsePayload.cartId;
        queryStringObject = {
          'id' : cartId
        };
        app.setObjectInLocalStorage('cartId',queryStringObject);
        app.client.request(undefined,'api/carts', 'GET', queryStringObject, undefined, (statusCode, responsePayload) => {
          if(statusCode == 200) {
            const table = document.getElementById("cartTable");
            let tr = table.insertRow(0);
            const pizzaTitle = document.createElement("th");
            pizzaTitle.innerHTML = "Order Summery";
            tr.appendChild(pizzaTitle);
            for(let i = 0; i < responsePayload.items.length; i++) {
              tr = table.insertRow(-1);
              tr.innerHTML = responsePayload.items[i].amount+" "+responsePayload.items[i].name;
            }
            tr = table.insertRow(-1);
            tr.innerHTML = "------------------------------";
            tr = table.insertRow(-1);
            tr.innerHTML = "Total Order Price: " +  responsePayload.totalCartPrice + "$";
          } else {
            console.log(statusCode + " Bad number!");
          }
        });
      } else {
        // user data not found - return to order create page
        window.location = '/orders/create';
      }
    });
  } else {
    // user data not found - return to order create page
    window.location = '/orders/create';
  }
};

// Loop to renew token often
app.tokenRenewalLoop = () => {
  setInterval(() => {
    app.renewToken((err) => {
      if(!err){
        console.log("Token renewed successfully @ "+Date.now());
      }
    });
  },1000 * 60);
};

// Init (bootstrapping)
app.init = () => {
  // Bind all form submissions
  app.bindForms();
  // Bind logout logout button
  app.bindLogoutButton();
  // Get the token from localstorage
  app.getSessionToken();
  // Renew token
  app.tokenRenewalLoop();
  // Load data on page
  app.loadDataOnPage();
};

// Call the init processes after the window loads
window.onload = () => {
  app.init();
};
