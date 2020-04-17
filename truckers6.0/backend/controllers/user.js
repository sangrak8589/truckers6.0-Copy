const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
  
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash,
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        role: req.body.role
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created!',
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
              message: "Invalid authentication credentials!"
          });
        });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id, companyId: fetchedUser.companyId},
        process.env.JWT_KEY,
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userRole: fetchedUser.role,
        username: fetchedUser.username,
        companyId: fetchedUser.companyId
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
};

exports.resetPassword = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email, username: req.body.username })
    .then(user => {
      if (!user) {
        return res.status(401).json({message: "Credentials don't exist"});
      }
      fetchedUser = user;
      bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        _id: fetchedUser.id,
        email: fetchedUser.email,
        password: hash,
        fname: fetchedUser.fname,
        lname: fetchedUser.lname,
        username: fetchedUser.username,
        role: fetchedUser.role
      });
      User.updateOne({_id: fetchedUser.id}, user)
      .then(result => {
        res.status(201).json({
          message: 'Update successful!'
        });
      })
      .catch(err => {
        res.status(500).json({
            message: "Invalid authentication credentials!"
        });
      });
    });
    })
}

exports.getUsers = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const userQuery = User.find();
  let fetchedUsers;
  if (pageSize && currentPage) {
    userQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  userQuery.then(documents => {
    fetchedUsers = documents;
    return User.count();
  }).then(count => {
    res.status(200).json({
      message: 'Users fetched successfully!',
      users: fetchedUsers,
      maxUsers: count
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching users failed!'
    })
  });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.id}).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Deletion successful!' });
    } else {
      res.status(401).json({ message: 'Not authorized!'});
    }
  }).catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    });
  });
};

exports.getUser = (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if(user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found!' });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching user failed!'
    });
  });
};

exports.updateUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        _id: req.body.id,
        email: req.body.email,
        password: hash,
        fname: req.body.fname,
        lname: req.body.lname,
        username: req.body.username,
        role: req.body.role,
        companyId: req.body.companyId
      });
      User.updateOne({_id: req.params.id}, user)
        .then(result => {
          res.status(201).json({
            message: 'Update successful!'
          });
        })
        .catch(err => {
          res.status(500).json({
              message: "Invalid authentication credentials!"
          });
        });
    });
}
