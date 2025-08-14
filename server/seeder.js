const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const connectDb = require('./config/db');

const Admin = require('./schemas/adminUserSchema');
const User = require('./schemas/userSchema');
const Pizza = require('./schemas/pizzaSchema');
const Order = require('./schemas/orderSchema');
const { Base, Sauce, Cheese, Veggie } = require('./schemas/inventorySchema');

const { users, admin } = require('./data/users');
const pizzas = require('./data/pizzas');
const { base, sauce, cheese, veggie } = require('./data/inventory');

dotenv.config();

// Connect to MongoDB
connectDb();

// to run --> node seeder.js

// const importData = async () => {
//   try {
//     // Clear collections
//     await Order.deleteMany();
//     await Pizza.deleteMany();
//     await User.deleteMany();
//     await Admin.deleteMany();
//     await Base.deleteMany();
//     await Sauce.deleteMany();
//     await Cheese.deleteMany();
//     await Veggie.deleteMany();

//     // Insert users and admin
//     const createdUsers = await User.insertMany(users);
//     const createdAdmin = await Admin.create(admin);

//     // Insert inventory--new
//     const createdBase = await Base.insertMany(base);
//     const createdSauce = await Sauce.insertMany(sauce);
//     const createdCheese = await Cheese.insertMany(cheese);
//     const createdVeggie = await Veggie.insertMany(veggie);

//     // Insert pizzas
//     // const createdPizzas = await Pizza.insertMany(pizzas);

//     console.log('Data Imported!'.green.inverse);
//     process.exit();
//   } catch (error) {
//     console.error(`${error}`.red.inverse);
//     process.exit(1);
//   }
// };

const importData = async () => {
  try {
    // Clear collections
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Admin.deleteMany();
    await Base.deleteMany();
    await Sauce.deleteMany();
    await Cheese.deleteMany();
    await Veggie.deleteMany();

    // Insert users and admin
    await User.insertMany(users);
    const createdAdmin = await Admin.create(admin);

    // Insert inventory
    const createdBase = await Base.insertMany(base);
    const createdSauce = await Sauce.insertMany(sauce);
    const createdCheese = await Cheese.insertMany(cheese);
    const createdVeggie = await Veggie.insertMany(veggie);

    // Map pizza ingredients from names to ObjectIds
    const pizzasWithIds = pizzas.map(pizza => ({
      ...pizza,
      base: createdBase.find(b => b.name === pizza.base)?._id || null,
      sauces: (pizza.sauces || [])
        .map(s => createdSauce.find(cs => cs.name === s)?._id)
        .filter(Boolean),
      cheeses: (pizza.cheeses || [])
        .map(c => createdCheese.find(cc => cc.name === c)?._id)
        .filter(Boolean),
      veggies: (pizza.veggies || [])
        .map(v => createdVeggie.find(cv => cv.name === v)?._id)
        .filter(Boolean),
      createdBy: 'admin' // ✅ correct type
    }));

    // Insert pizzas
    await Pizza.insertMany(pizzasWithIds);

    console.log('✅ Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Admin.deleteMany();
    await Order.deleteMany();
    await Pizza.deleteMany();
    await User.deleteMany();
    await Base.deleteMany();
    await Sauce.deleteMany();
    await Cheese.deleteMany();
    await Veggie.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}




  