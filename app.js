const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./.config')
const errorController = require('./controllers/error');
const userService = require('./services/UserService')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');

const birthdayReminder = require('./queue/BirthdayReminder');

userService.birthdayReminder(
  config.cron.birthdayReminder
);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));



app.use(adminRoutes);

app.use(errorController.get404);

process.on('uncaughtException', async () => {
  // Queue#close is idempotent - no need to guard against duplicate calls.
  try {
    console.log('Shutting Down BeeQueue');
    await Promise.all([
      birthdayReminder.close(TIMEOUT),
    ]);
  } catch (err) {
    console.error('bee-queue failed to shut down gracefully', err);
  }
  process.exit(1);
});

mongoose
  .connect(
    'mongodb+srv://root:qff5Kji82QLusEV@codingtest.vwoea.mongodb.net/digitalEnvasion?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });