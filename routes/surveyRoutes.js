const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false // don't return recipients field
    });
    res.send(surveys);
  });

  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thanks for voting!");
  });

  // Sendgrid make post request to here, contain a array of obj
  // https://ueilewqqqqwwwwwx.localtunnel.me/api/surveys/webhooks
  /* req.body
  [ { ip: '172.250.107.87',
      sg_event_id: 'Dh8iJtTrSYqz79NTJHKiPA',
      sg_message_id: 'tWS5t_0AQqCUTtWjy_8bOA.filter0072p3las1-18229-5C1EEAC6-10.0',
      useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      event: 'click',
      url_offset: { index: 0, type: 'html' },
      email: 's777610@gmail.com',
      timestamp: 1545530065,
      url: 'http://localhost:3000/api/surveys/5c1eeac5afcbdd3d65df73aa/yes' } 
  ]*/
  app.post("/api/surveys/webhooks", (req, res) => {
    const p = new Path("/api/surveys/:surveyId/:choice"); //  can assign surveyId and choice into obj
    _.chain(req.body)
      .map(({ email, url }) => {
        const pathname = new URL(url).pathname; // extract pathname without domain name
        const match = p.test(pathname); // { surveyId: '5c1f77a40841c4435f647579', choice: 'yes' }
        if (match) {
          return {
            email,
            surveyId: match.surveyId,
            choice: match.choice
          };
        }
      })
      .compact() // remove undefined element from array
      .uniqBy("email", "surveyId") // remove duplicates from array
      // [ { email: 'a@a.com', surveyId: '5c1', choice: 'yes' }, {}, .. ]
      .each(({ surveyId, email, choice }) => {
        // we don't need async because we don'n need to response
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            // increment either yes or no by 1 on survey record
            $inc: { [choice]: 1 }, // we don't know choice is yes or no
            // updated responded of recipients on survey
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec(); // execute the query
      })
      .value();

    res.send({});
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    // Great place to send an email
    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
