
function User(name) {
  this.name = name;
}

exports.findOne = function (params, callback) {
  callback(null, new User('admin'));
};

exports.findOrCreate = function (params, callback) {
  callback(null, new User('admin'));
};

exports.findByOpenID = function (params, callback) {
  callback(null, new User('admin'));
};

exports.findById = function (params, callback) {
  callback(null);
};

User.prototype.verifyPassword = function (password) {
  return true;
};

exports.module = User;
