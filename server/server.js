const express = require('express');
const webpack = require('webpack');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const webpackDevMiddleware = require('webpack-dev-middleware');

const getIP = require('ipware')().get_ip;
const moment = require('moment');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const dotenv = require('dotenv').config();

// require("babel-core/register");
// require("babel-polyfill");

const app = express();
const config = require('../webpack.dev.js');
const compiler = webpack(config);
const apiRouter = express.Router();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const db = require('../db/config');
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('../dist'));

app.use('/api', apiRouter);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Declare api routes BEFORE * route
apiRouter.route('/gameslist')
  .get(cors(corsOptions), (req, res) => {
    db.games.findAll()
      .then(games => {
      res.send(games);
    })
});

apiRouter.route('/gameSettings')
  .get(cors(corsOptions), (req, res) => {
    db.game_types.findAll()
      .then(gameTypes => {
        db.game_difficulties.findAll()
        .then(gameDifficulties => {
          let gameSettings = {
            game_types: gameTypes,
            game_difficulties: gameDifficulties,
          }
          res.send(gameSettings);
        })
      })
});

apiRouter.route('/postScore')
  .post((req, res) => {
    console.log('THIS IS THE REQ BODY UP IN THAT POST SCORE 🤘')
    console.log(req.body)

    // TODO: remove this after testing
    let userIP = getIP(req);
    console.log('IP: $$$$$$$$$$$$$$$$ IP: ', userIP);

    let score = {
      'user_id': 1,
      'count_polygons_entered': req.body.countPolygonsEntered,
      'count_total_submissions': req.body.countTotalSubmissions,
      'polygons_answered': JSON.stringify(req.body.polygonsAnswered),
      'polygons_unanswered': JSON.stringify(req.body.polygonsUnanswered),
      'incorrect_entries': JSON.stringify(req.body.incorrectEntries),
      'game_id': req.body.gameID,
      'game_type_id': req.body.gameTypeID,
      'game_difficulty_id': req.body.gameDifficultyID,
      'game_timer_start': req.body.gameTimerStart,
      'game_timer_remaining': req.body.gameTimerRemaining,
      'game_start_timestamp': req.body.gameStartTimestamp,
      'game_end_timestamp': req.body.gameEndTimestamp,
      'ip_where_game_played': getIP(req)
    }
    db.scores.create(score)
    .then(score => {
      res.send(score);
      console.log('did we ✍🏽 to the db? mayhaps')
    })
    .catch(error => {
      throw error
    })
});

apiRouter.route('/login')
  .post((req, res) => {
    const email = req.body.email,
        password = req.body.password;
    db.users.findOne({ where: { email: email } }).then(function (user) {
      if(!user) {
        console.log('user does not exist');
      } else {
      user.validPassword(password)
        .then(validUser => {
          if(validUser) {
            console.log('valid user');
            res.send(user);
          } else {
            console.log('wrong password');
          }
        })
      }
    });
  })

apiRouter.route('/userId')
  .get((req, res) => {
    db.users.findOne({
      where: {user_id: req.query}
    }).then(user => {
      res.send(user);
    })
  })

apiRouter.route('/user')
  .get((req, res) => {
    let date = moment();
    db.users
    .findOrCreate({where: {google_id: req.query.googleId}, defaults: {
      'google_id': req.query.googleid,
      'first_name': req.query.givenName,
      'last_name': req.query.familyName,
      'count_games_played': 0,
      'last_login': date,
      'email': req.query.email
    }})
    .spread((user, created) => {
      user.created = created;
      res.send(user);
    });
  })
  .post((req, res) => {
    let date = moment();
    // This should probably be put into some sort of helper file
    let user = {
      'first_name': req.body.firstName,
      'last_name': req.body.lastName,
      'email': req.body.email,
      'count_games_played': 0,
      'last_login': date,
      'password_hash': req.body.password
    };
    db.users.create(user)
    .then(user => {
      res.send(user);
    })
    .catch(error => {
      console.log(error);
    })
  });


app.get('/*', (req, res) => {
  res.sendFile(path.resolve('./dist', 'index.html'));
});

app.listen(1337, function() {
  console.log('😎 listening on 1337');
});
