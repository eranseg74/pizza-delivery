# Web final project - Application development course - HackerU
A CLI for the Pizza-Delivery project - Web final project

# pizza-delivery

A CLI interface and Frontend for the pizza-delivery RESTful API.

The CLI interface allow the manager of the pizza place to:

1. View all the current menu items.
   To view all the current items in the menu, enter the command - 'menu'.

2. View all the recent orders in the system (orders placed in the last 24 hours).
   To view all the recent orders in the system, enter the command - 'list orders'.

3. Lookup the details of a specific order by order ID.
   To lookup the details of a specific order by order ID, enter the command - 'more order info --{orderId}'.

4. View all the users who have signed up in the last 24 hours.
   To view all the users who have signed up in the last 24 hours, enter the command - 'list users'.

5. Lookup the details of a specific user by email address.
   To lookup the details of a specific user by user ID, enter the command - 'more user info --{userId}'.

On this frontend new users can be created, their information can be updated and they can be deleted.
The user's information includes their first name, last name, password, email, address and tosAgreement. The address is an object that includes the street, city, country and postal code.

A user can log in or log out by creating or destroying a token.

When a user is logged in, they can see their previous orders. Each user can have up to 5 orders (just for practicing a limit to the orders - obviously a user won't be limited to a number of orders).

A user can choose any kind of pizza available on the menu and add it to a shopping cart. before creating the cart the user can see the cost of each pizza, the the total cost of the pizza according to the ordered amount, and the total cart price.

When proceeding to the order submit page the user vies the order details along with the price. the user can then either delete the cart and start a new order or submit the order.

When an order is placed successfully the cart is no longer needed and therefore is deleted from the user's data. Also, on successful order a mail is sent to the user with the order id, the time when the order was submitted, a list of all the ordered pizzas with the amount of each type, and the total price of the order (with the currency).

On this project, the payment is done by integrating with the Sandbox of Stripe and the mail is sent to the users by integrating with the sandbox of Mailgun.
_____
# Pages
## index
This is the HOME page of this frontend. It contains a title and a short description of the products. If the user is not logged in a GET STARTED and LOG IN buttons are available for the user in order to create an account or log in.
On a successful account creation or log in the user is redirected to the dashboard where they can watch their orders list
##
-----
## accountCreate
On this page the user fills all the necessary fields in order to create their account. On a successful account creation the user is directed to their dashboard.
##
-----
## sessionCreate
On this page the user fills their email and password in order to log in to the application. On a successful log in the user is redirected to their dashboard.
##
-----
## accountEdit
On this page a user can update their details or delete their account. When a user deletes their account, all their orders are deleted and the user is logged out.
##
-----
## accountDelete
A user is redirected to this page from the account editing page. the user can then go to the home page and create a new account.
##
-----
## accountCreate
On this page the user fills all the necessary fields in order to create their account. On a successful account creation the user is directed to their dashboard.
##
-----
## sessionDeleted
A user is redirected to this page right after logging out from the application. The user can the log back to their account from this page or from the home page.
##
-----
## ordersList (The Dashboard)
On this page the user can view all their orders. From this page the user starts the ordering process.
##
-----
## ordersCreate
On this page the user can choose any item from the menu, along with the desired amount of items. this page is created dynamically according to the menu. Any changes in the menu will be reflected on this page, letting the user to choose the new items. When the user finishes filling the cart and proceeds to checkout the cart is created and stored in the user's data.
##
-----
## ordersSubmit
After completing filling the cart on the ordersCreate page the user is redirected to this page where they can view all of their order details along with the total price. The user can then choose to delete their order (which will cause a deletion of the cart and redirect the user to their dashboard) or submit the order. Submitting the order will charge the user (using Stripe.com) and send the user a mail with the order data, containing the order id, time of order, ordered items and the total price of the whole order.
##
-----
_____
# Elements
## Users
Represents all the users that were defined or will be created. A user should have all the specified properties as shown in the ```post``` function below.
##
### Users Functions

A user is created using **POST**.
> Required fields for the user are (all from the payload):
> #### * *firstName*
> #### * *lastName*
> #### * *password*
> #### * *email*
> #### * *address*:
>   * *street*
>   * *city*
>   * *country*
>   * *postalCode*
> #### * tosAgreement
#
A user information can be accessed using **GET**.
> Required fields for the **GET** function are:
> #### * *email* - from the query
> #### * *password* - from the headers
#
A user information can be updated using **PUT**.
> Required fields for the **PUT** function are:
> #### * *email* - from the payload
> #### * *token* - from the headers
> Optional fields (at least one field must be submitted):
> #### * *firstName* - from the payload
> #### * *lastName* - from the payload
> #### * *password* - from the payload
> #### * *address*: - from the payload
>   * *street* - from the payload
>   * *city* - from the payload
>   * *country* - from the payload
>   * *postalCode* - from the payload
#
A user can be deleted using **DELETE**.
> Required fields for the **DELETE** function are:
> #### * *email* - from the headers
-----
## Tokens
Represents uniqe keys given to all users. Tokens are used to identify the users allowing them to perform actions like reading the menu or their orders information.
######
A user can have only one Token which is destroyed when the user is deleted.
##
### Tokens Functions

A token is created using **POST**.
> Required fields for the user are (all from the payload):
> #### * *password*
> #### * *email*
#
A token can be accessed using **GET**.
> Required fields for the **GET** function are:
> #### * *id* - token id from the query
#
A token can be updated using **PUT**.
> Required fields for the **PUT** function are:
> #### * *id* - token id from the payload
> #### * *extend* - from the payload
#
A user can be deleted using **DELETE**.
> Required fields for the **DELETE** function are:
> #### * *email* - from the headers
-----
## Carts
Represents the shopping carts. A user can add all available pizzas on the menu to the cart before placing the order. When an order is placed the cart is deleted.
##
### Carts Functions

A cart is created and updated using **POST**.
> Required fields for the user are:
> #### * *name* - of the requested pizza from the payload
> #### * *amount* - Slices number of the requested pizza from the payload
> #### * *token* - The user's token from the headers
> The required data comes as an array of object in order to allow the creation of a cart with multiple items and not posting one item at a time.
> When a cart is created a unique cart id that represents the specified cart is generated and stored.
#
A token can be accessed using **GET**.
> Required fields for the **GET** function are:
> #### * *id* - cart id from the query
> #### * *token* - The user's token from the headers
#
A user can be deleted using **DELETE**.
> Required fields for the **DELETE** function are:
> #### * *id* - cart id from the query
> #### * *token* - The user's token from the headers
-----
## Orderes
Represents a user's order. When an order is called (using ```POST```) a payment process is executed and a mail is sent to the user with all the order's data. The order is then stored in an array that includes all the specified user's previous orders.
##
### Orders Functions

An order is created and processed using **POST**.
> Required fields for the user are:
> #### * *id* - cart id from the query
> #### * *token* - The user's token from the headers.
> All orders id are stored in an array on the user's object.
#
An order can be accessed using **GET**.
> Required fields for the **GET** function are:
> #### * *id* - order id from the query
> #### * *token* - The user's token from the headers
#
-----
## Menus Functions

The menu object contains all the available pizzas a user can purchase.
A menu can be accessed using **GET**.
> Required fields for the **GET** function are:
> #### * *email* - order id from the headers
> #### * *token* - The user's token from the headers
#
#
-----
# Required fields for executing the payment with Stripe
When an order is placed a payment is executed using the ```placeOrder``` function on the ```helpers.js``` file.
######
In order to complete the payment you must add the stripe token, the currency and the stripe secret key provided to you by Stripe.
######
You should fill this fields on the ```config.js``` file. The ```placeOrder``` function will then collect the information and constract a request to Stripe in order to complete the payment.

-----
# Required fields for sending mail with Mailgun
When an order is placed a mail is sent to the user with all the order's information using the ```sendReceiptViaMailgun``` on the ```helpers.js``` file.
######
In order to send an email you must define a ```domain```, an ```api_key``` and a ```from``` fields.
######
You should fill this fields on the ```config.js``` file. The ```sendReceiptViaMailgun``` function will then collect the information and constract a request to Mailgun in order to send the email to the user.
