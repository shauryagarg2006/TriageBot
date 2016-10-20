var main = require("./main.js")
var repo = "TriageBotTesting";
var repoOwner= "hqtu"
var Promise = require("bluebird");
var _ = require("underscore");
if (!process.env.BOT_TOKEN) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}
var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true
});

var bot = controller.spawn({
    token: process.env.BOT_TOKEN
}).startRTM();

// Listen for a request for issues to work on (TODO Make this a conversation instead!)
controller.hears(['give me issues'], 'direct_message, direct_mention, mention', function(bot, message) {

    // bot.api.reactions.add({
    //     timestamp: message.ts,
    //     channel: message.channel,
    //     name: 'robot_face',
    // }, function(err, res) {
    //     if (err) {
    //         bot.botkit.log('Failed to add emoji reaction :(', err);
    //     }
    // });

    controller.storage.users.get(message.user, function(err, user) {
        // if (user && user.name) {
        main.countOpen(repoOwner, repo).then(function (results)
        {
          bot.reply(message, results);
        });
        bot.startConversation(message, askWhichIssue);
        // }
    });
});

//
askWhichIssue = function(response, convo)
{
  convo.ask("What issue number do you want to work on?", function(response, convo){
    main.assignIssueToUser(repoOwner, repo, response.text, repoOwner).then(function(resp){
      convo.say(resp);
      convo.next();
    });
  });
}

controller.hears(['deadlines for (.*)', 'Deadline for (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {

        main.getIssuesAssigedToAuser(repoOwner,repo,name).then(function (results)
        {
            bot.reply(message, results);
        }).catch(function (e){
            bot.reply(message, e+name);
        });

    });
});

controller.hears(['Help me with issue #(.*)', 'help me with issue #(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var number = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {

        main.getFreeDevelopers(repoOwner,repo,number).then(function (results)
        {

            bot.reply(message, results);
        }).catch(function (e){
            bot.reply(message, e);
        });

    });
});
