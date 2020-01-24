/*
 * An object that represents a pizza menu including various pizzas and their prices
 *
 */

 const menu = [
   {
     'name' : 'Plain',
     'ingredients' : ['cheese', 'tomato'],
     'price' : 3
   },
   {
     'name' : 'ExFlavor',
     'ingredients' : ['onion', 'mushrooms'],
     'price' : 4
   },
   {
     'name' : 'Pepperoni',
     'ingredients' : ['pepperoni', 'onion', 'mozzarella'],
     'price' : 5
   },
   {
     'name' : 'AllInOne',
     'ingredients' : ['cheese', 'tomato', 'pepperoni', 'onion', 'mozzarella', 'mushrooms'],
     'price' : 6
   }
 ];

 // Export the module
 module.exports = menu;
