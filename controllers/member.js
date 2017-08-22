var User = require('../models/user');
const service = require('../services/index')

function createMember(req) {
  let member = new User();
  user.name = req.body.name;
  user.dadLastName = req.body.dadLastName;
  user.momLastName = req.body.momLastName;
  //user.birthday     = req.body.birthday;
  user.email = req.body.email;
  user.password = user.generateHash(req.body.memberId);
  user.cp = req.body.cp;
  //user.gender       = req.body.gender;
  user.cellphone = req.body.cellphone;

  user.membership.memberId = req.body.memberId;
  user.membership.type = 'A';
  user.membership.startDate = Date.now();
  user.membership.expiringDate = Date.now();
  user.membership.expiringDate.setTime(
    user.membership.expiringDate.getTime() + expiringTime * 86400000);

  return member;
}

function insertMember(req, res) {
  User.findOne({
      'email': req.body.email
    },
    (err, user) => {
      if (err) {
        throw err;
      }
      if (!user) {
        let member = createMember(req);
        member.save((err) => {
          if (err) {
            throw err;
          }
          res.status(200).redirect('/');
        });
      } else {
        res.status(500).render('pages/500', {
          message: 'El usuario ya existe'
        });
      }
    }
  );
}

function getMembersByName(req, res) {
  let name = req.query.name;
  User.find({
      'name': new RegExp(name),
      'accType': 'member'
    },
    (err, members) => {
      if (err) {
        throw err;
      }
      if (members.length == 0) {
        res.status(204).send('Not found');
      } else {
        res.status(200).send(members);
      }
    });
}

function loadMemberProfile(req, res) {
  User.findOne({
      'membership.memberId': req.body.memberId
    },
    (err, member) => {
      if (err) {
        throw err;
      }
      if (member) {
        res.status(200).render('pages/profile', {
          user: member
        });
      } else {
        res.status(204).redirect('error');
      }
    });
}

module.exports = {
  createMember,
  insertMember,
  getMembersByName,
  loadMemberProfile
}
