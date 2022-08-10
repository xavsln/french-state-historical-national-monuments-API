const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const Models = require('./models.js');

const Monuments = Models.Monument;
const Users = Models.User;

const { check, validationResult } = require('express-validator');

mongoose.connect('mongodb://localhost:27017/frenchStateHistoricalMonumentsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Setup body-parser
app.use(bodyParser.json());

// ========================
// GET routes
// ========================

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to the French State Historical Monuments API!');
});

// READ - Returns a list of all Monuments
app.get('/monuments', (req, res) => {
  // res.send("This should render the list of all monuments available in the API");
  Monuments.find()
    .then(monuments => {
      res.status(201).json(monuments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Returns data in JSON format of specific Monument by monumentId
app.get('/monuments/:monumentId', (req, res) => {
  // res.send("This should render data of a specific monument");
  Monuments.findOne({ _id: req.params.monumentId })
    .then(monument => {
      if (monument) {
        res.status(200).json(monument);
      } else {
        res.status(400).send('No such a monument in the database.');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Returns data in JSON format all Monuments corresponding to a specific Type
app.get('/monuments/types/:monumentType', (req, res) => {
  // res.send("This should render data of a specific monument");
  Monuments.find({ type: req.params.monumentType })
    .then(monumentsWithType => {
      if (monumentsWithType) {
        res.status(200).json(monumentsWithType);
      } else {
        res.status(400).send('No such a monument in the database.');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Returns data in JSON format of all monuments located in a given city
app.get('/monuments/locations/cities/:cityName', (req, res) => {
  Monuments.find({ cityLocation: req.params.cityName })
    .then(monuments => {
      // console.log(req.params.cityName);
      console.log(monuments);
      res.status(201).json(monuments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Returns data in JSON format of all monuments located in a given department
app.get('/monuments/locations/departments/:departmentName', (req, res) => {
  Monuments.find({ departmentLocation: req.params.departmentName })
    .then(monuments => {
      // console.log(req.params.cityName);
      console.log(monuments);
      res.status(201).json(monuments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Returns data in JSON format of all monuments located in a given department
app.get('/monuments/locations/regions/:regionName', (req, res) => {
  Monuments.find({ regionLocation: req.params.regionName })
    .then(monuments => {
      console.log(monuments);
      res.status(201).json(monuments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Returns data in JSON format of all Users
app.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      console.log(users);
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ - Return data about a User by name
app.get(
  '/users/:username',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ username: req.params.username })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// =============
// POST requests
// =============

// CREATE - Allow new User to register (Add a new user to the usersList)
app.post(
  '/users',
  [
    check(
      'Username',
      'Username with a minimum of 5 characters is required'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required')
      .not()
      .isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ username: req.body.Username })
      .then(user => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users.create({
            username: req.body.Username,
            password: hashedPassword,
            // password: req.body.Password,
            email: req.body.Email,
            birthday: req.body.Birthday,
            role: req.body.Role
          })
            .then(user => {
              res.status(201).json(user);
            })
            .catch(error => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

// ADD a Monument to the user list of favorite Monuments
app.post(
  '/users/:userId/monuments/:monumentId',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $addToSet: { favoriteMonuments: req.params.monumentId }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// =============
// DELETE requests
// =============

// DELETE a Monument from the user list of favorite Monuments
app.delete(
  '/users/:userId/monuments/:monumentId',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $pull: { favoriteMonuments: req.params.monumentId }
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// DELETE a User from the user list
app.delete(
  '/users/:userId',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ _id: req.params.userId })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.userId + ' was not found');
        } else {
          res.status(200).send(req.params.userId + ' was deleted.');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
