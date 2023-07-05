const express = require("express");
const app = express();

// To generate the unique id while adding the user (POST Request) [1]
const { v4: uuidv4 } = require('uuid'); 
const userRoute = require("./router/routes");

const userObjects = require("./database/users");

app.use(express.json());

app.use("/",userRoute);

// Getting all users list over here
userRoute.get('/users', (req, res) => {
  try {
    res.json({
      message: 'Users retrieved',
      success: true,
      users: userObjects
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      success: false
    });
  }
});

// Retrieve user by ID
userRoute.get('/user/:id', (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = userObjects.find(userObjects => userObjects.id === id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      success: false
    });
  }
});

// Update user by ID
userRoute.put('/update/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { email, firstName } = req.body;

    // Find the user by ID
    const user = userObjects.find(user => user.id === id);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        success: false
      });
    }

    // Update the user's email and/or firstName if provided
    if (email) {
      user.email = email;
    }
    if (firstName) {
      user.firstName = firstName;
    }

    res.json({
      message: 'User updated',
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      success: false
    });
  }
});

userRoute.post('/add', (req, res) => {
  const { email, firstName } = req.body;

  // Check if the user already exists
  const existingUser = userObjects.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists',
      success: false
    });
  }

  // Generate a new unique ID for the user (you can use a library like `uuid` for this)
  const id = uuidv4();

  // Create a new user object
  const newUser = {
    email: email,
    firstName: firstName,
    id: id
  };

  // Add the new user to the array
  userObjects.push(newUser);

  res.json({
    message: 'User added',
    success: true
  });
});

module.exports = app;

/***
 *  References:
 *  
 *  [1]	U. Goodness, “Understanding UUIDs in node.Js,” LogRocket Blog, 17-Oct-2022. [Online]. 
 *      Available: https://blog.logrocket.com/uuids-node-js/. [Accessed: 30-Jun-2023].
 * 
 */