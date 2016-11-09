var main = require("./main.js")
var repo = "hqtu";
var repoOwner= "TriageBotTesting"
var Promise = require("bluebird");
var _ = require("underscore");
if (!process.env.BOT_TOKEN) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}
var Botkit = require('botkit');
var os = require('os');

var controller = Botkit.slackbot({
  debug: false
});

var bot = controller.spawn({
  token: process.env.BOT_TOKEN
}).startRTM();

var currentUser;

// Listen for a request for issues to work on (TODO Make this a conversation instead!)
controller.hears(['give me issues'], 'direct_message, direct_mention, mention', function(bot, message) {


  controller.storage.users.get(message.user, function(err, user) {
        // if (user && user.name) {
          currentUser = user;
          main.getMatchingIssues(repoOwner, repo, "open").then(function (results)
          {
            var string;
            if(results.length == 0){
              string = "No issues to work on for now!";
            } else {
              var titles = _.pluck(results, "title");
              var urls = _.pluck(results, "html_url");
              string = "*Here are some open issues:*\n";
              for(var i = 0; i < results.length; i++){
               string += (i + 1) + ". "+ titles[i] + ": ";
               string += urls[i] + "\n";
             }
           }
           bot.reply(message, string);
         });
          bot.startConversation(message, askWhichIssue);
        // }
      });
});

// Asks user which issue to work on, where the user must reply with issue number
askWhichIssue = function(response, convo)
{
  convo.ask("What issue number do you want to work on?", function(response, convo){
    main.assignIssueToUser(currentUser, repoOwner, repo, response.text, currentUser.git_name).then(function(resp){
      convo.say(resp);
      convo.next();
    });
  });
}

var deadline_conversation_asking_for_issueNumber = function(response, convo,results,name,message)
{

  convo.ask("What issue do you want to assign to "+name+" ?",function(response, convo) {
   console.log("Entered Issue Number - "+response.text);
   main.assignIssueForDeadline(results,response.text,name).then(function(resp){
    console.log("Entered Issue Number II - "+response.text);
    bot.reply(message,resp);
    convo.next();
  }).catch(function (e){
    
    bot.reply(message,"Invalid response please enter again!");
      
      convo.repeat();
      convo.next();
    });;


});

}


var deadline_conversation_asking_for_assignment = function(response, convo,name,message)
{
  main.getOpenIssuesForDeadlines(repoOwner,repo).then(function (results)
  {

    var result =[];
      //TODO Strip date
      console.log(results.length+" -LENGTH");
      for(i=0;i<results.length;i++){
        result.push(i+1+" ) "+results[i].title);
        result.push(results[i].html_url);
        //result.push('Deadline- '+results[i].milestone.due_on);
        result.push('\n');
      }
      convo.say("No Deadlines found for "+name);
      convo.ask("Do you want to assign him any of the open issues?", [
      {
        pattern: 'yes',
        callback: function(response, convo) {
         convo.say(result.join('\n'));
         deadline_conversation_asking_for_issueNumber(response,convo, results,name,message);
         convo.next();
       }
     },
     {
      pattern: 'no',
      callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                  }
                                },
                                {
                                  default: true,
                                  callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                  }
                                }
                                ]);
    }).catch(function (e){
      convo.say(e);
      convo.stop();
    });
  }

  controller.hears(['deadlines for (.*)', 'Deadline for (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {

      main.getIssuesAssigedToAuser(repoOwner,repo,name).then(function (results)
      {
        bot.reply(message, results);
      }).catch(function (e){
     //   bot.reply(message, e+name);
     bot.startConversation(message, function(err,convo){
      deadline_conversation_asking_for_assignment(err,convo,name,message);

    });

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


  controller.hears(['Hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {

      if (user && user.name && user.git_name) {

        bot.reply(message, 'Hello ' + user.name );
      } else {
        bot.startConversation(message, function(err, convo) {
          if (!err) {
            if(!user || !user.name)
              asking_name(err,convo,message);
            else{
              bot.reply(message, 'Hello ' + user.name );
              asking_git_hub_name(err,convo,message);
            }
       // store the results in a field called nickname
       convo.on('end', function(convo) {
        if (convo.status != 'completed') {


          bot.reply(message, 'OK, nevermind!');
        }
      });
     }
   });
      }
    });

  });



  var asking_name = function(response, convo, message) {
    convo.say('Hey there, I do not know your name yet!');
    convo.ask('What should I call you?', function(response, convo) {
      convo.ask('You want me to call you `' + response.text + '`?', [
      {
        pattern: 'yes',
        callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    controller.storage.users.get(message.user, function(err, user) {
                                      if (!user) {
                                        user = {
                                          id: message.user,
                                          git_name : '',
                                        };
                                      }
                                      user.name = convo.extractResponse('nickname');
                                      controller.storage.users.save(user, function(err, id) {
                                        bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                      });
                                    });
                                    asking_git_hub_name(response,convo, message);
                                    convo.next();
                                  }
                                },
                                {
                                  pattern: 'no',
                                  callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'

                                    convo.stop();
                                  }
                                },
                                {
                                  default: true,
                                  callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                  }
                                }
                                ]);

convo.next();

}, {'key': 'nickname'});
};

var asking_git_hub_name = function(response, convo, message) {

  convo.ask('What is your github username?', function(response, convo) {
    convo.ask('Your github user name is `' + response.text + '`? Please confirm', [
    {
      pattern: 'yes',
      callback: function(response, convo) {
        // since no further messages are queued after this,
        // the conversation will end naturally with status == 'completed'
        controller.storage.users.get(message.user, function(err, user) {
          user.git_name = convo.extractResponse('git_nickname');
          controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it! updating you github user name as ' + user.git_name + ' from now on.');
          });
        });
        convo.next();
      }
    },
    {
      pattern: 'no',
      callback: function(response, convo) {
        // stop the conversation. this will cause it to end with status == 'stopped'
        convo.stop();
      }
    },
    {
      default: true,
      callback: function(response, convo) {
        convo.repeat();
        convo.next();
      }
    }
    ]);

    convo.next();

  }, {'key': 'git_nickname'});
};



controller.hears(['.*'], 'direct_message, direct_mention, mention', function(bot, message) {

  controller.storage.users.get(message.user, function(err, user) {
        // if (user && user.name) {
          if (user && user.name) {
            bot.reply(message,"Sorry couldn't understand it "+ user.name );
          }else{
            bot.reply(message,"Sorry couldn't understand it ");
          }
          bot.reply(message,"Below are is the list of commands you can use:");
          bot.reply(message,"1. Dealine for <git_user_name>");
          bot.reply(message,"2. Help me with issue #<github issue number>");
          bot.reply(message,"3. Give me issues");

        // }
      });
});
