const bcrypt = require('bcrypt');

async function hashPassword(password){
    return bcrypt.hash(password, 10);
}
async function comparePassword(password, hashedPassword){
    return bcrypt.compare(password, hashedPassword);
}

function isLoggedIn(){
    return function (req, res, next){
        if(req.session.user){
            next();
        }else{
            res.redirect('/login');
        }
    }
}

function mapError(err){
    if(Array.isArray(err)){
        return err;
    } else if(err.name == 'MongoServerError'){
        if(err.code == 11000){
            return [{msg: 'Username already exists'}];
        }else{
            return [{msg: 'Request error'}];
        }
    }else if(err.name == 'ValidationError'){
        return Object.values(err.errors).map(e => ({msg: e.message}));
    }else if(typeof err.message == 'string'){
        return [{msg: err.message}];
    }else{
        return [{msg: 'Request error'}];
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    isLoggedIn,
    mapError
}