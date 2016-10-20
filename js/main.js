var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var _ = require("underscore");
var stringSimilarity = require('string-similarity');
var github = require("./github.js");

// Which person is assigned to most to issues?
function findMostFrequentAssignee(user,repo)
{
	return new Promise(function (resolve, reject)
	{
		// mock data needs list of issues.
		github.getIssues(user,repo).then(function (issues)
		{
			var names = _.pluck(issues,"assignee")
			var frequency = _.countBy(names, function (name) { return name; });
			var max = _.max(_.keys(frequency), function(item){ return frequency[item] })
			resolve({userName: max, count: frequency[max]});
		});
	});
}

// Return open issues in a user's repo
function countOpen(user,repo)
{
	return new Promise(function (resolve, reject)
	{
		github.getIssues(user, repo).then(function (issues)
		{
			var states = _.where(issues, { state: "open"});
			var string;
			if(states.length == 0){
				string = "No issues to work on for now!";
			} else {
				var titles = _.pluck(states, "title");
				var urls = _.pluck(states, "html_url");
				string = "*Here are some open issues:*\n";
				for(var i = 0; i < states.length; i++){
					string += (i+1)+". "+ titles[i] + ": ";
					string += urls[i] + "\n";
				}
			}
			resolve(string);
		});
	});
}

// TODO complete once the conversation structure is implemented on triageBot
function assignIssueToUser(owner, repo, issue, assigneeName)
{
	// return new Promise(function(resolve, reject){
	// 	github.assignIssue(user, repo, issue, assigneeName).then(function(assigned){
	// 		var string;
	// 		if(assigned != ""){
	// 			string = "Could not assign the issue to "+assigneeName;
	// 		} else {
	// 			string = "Assigned "+issue+" to "+ (assigneeName == owner ? "you" : assigneeName);
	// 		}
	// 		console.log(string);
	// 		resolve(assigned);
	// 	});
	// });
}

function getIssuesAssigedToAuser(owner,repo,assigneeName)
{
	return new Promise(function (resolve, reject)
	{
		// mock data needs list of issues.
		github.getIssues(owner,repo).then(function (issues)
		{
			var resSet=[];
			//TODO add code for fetching open issues
			var issuesWithAssignee =  _.reject(issues,function(issueVar){
				if(issueVar.assignee == null || issueVar.state!='open' || issueVar.milestone == null)
				{
					return true;
				}else
				return false;
			});

			var issuesForAssignee = _.filter(issuesWithAssignee,function(issueVar){

				var assigneesArray =issueVar.assignees;


				for (i = 0; i < assigneesArray.length; i++){
					if(assigneesArray[i].login == assigneeName){

						return true;
					}
				}

				return false;
			});
			if(!issuesForAssignee.length){
				reject("No deadlines found for ");
			}

			var result =[];
			//TODO Strip date
			for(i=0;i<issuesForAssignee.length;i++){
				result.push(issuesForAssignee[i].title);
				result.push(issuesForAssignee[i].html_url);
				result.push('Deadline- '+issuesForAssignee[i].milestone.due_on);
				result.push('\n');


			}

			resolve(result.join('\n'));

		});
	});
}

function getFreeDevelopers(owner,repo, number)
{
	return new Promise(function (resolve, reject) 
	{
		// mock data needs list of issues.
		github.getIssues(owner,repo).then(function (issues) 
		{
			
			var closedIssues =  _.reject(issues,function(issueVar){ 
				if(issueVar.state ==='open' || issueVar.assignees === 'null')
				{
					return true;
				}
				else
					return false;
			});
			var topIssue = [];
			var maxsimScore = 0;
			yissue = _.find(issues, function(issue){return issue.number == number;});
			var similarIssues = _.filter(closedIssues,function(issueVar){ 
			var similarityScore = stringSimilarity.compareTwoStrings(issueVar.title + " " + issueVar.body, yissue.title + " " + issueVar.body);
			if(similarityScore > 0){
				if(similarityScore > maxsimScore)
				{
					maxsimScore = similarityScore;
					topIssue.push(issueVar);
				}
				return true;
			}
			else{
				return false;
			}
			});
			/*
			if(!similarIssues.length){
				reject("Sorry, couldn't find anyone to help you");
			}
			
			var result =[];
			//TODO Strip date
			for(i=0;i < similarIssues.length;i++){
				for(j = 0; j<similarIssues[i].assignees.length;j++)
				{
					result.push(similarIssues[i].assignees[j].login);
				}
			}
			yissuedl = [];

			for(i=0;i < yissue.assignees.length;i++){
				yissuedl.push(yissue.assignees[i].login);
			}

			result = _.difference(result, yissuedl);*/
			var result =[];
			yissuedl = [];

			for(i=0;i < yissue.assignees.length;i++){
				yissuedl.push(yissue.assignees[i].login);
			}
			for(i = 0;i < topIssue[0].assignees.length;i++){
				result.push(topIssue[0].assignees[i].login);
			}
			console.log(result, yissuedl);
			result = _.difference(result, yissuedl);
			if(!result.length){
				reject("Sorry, couldn't find anyone to help you");
			}
			else{
				resolve("I think " + result.join(',') + " could help you");	
			}
		});
	});
}



/*function getDeadlinesForUser(owner,repo,assigneeName)
{
	return new Promise(function (resolve, reject)
	{
		// mock data needs list of issues.
		getIssuesAssigedToAuser(user,repo,assigneeName).then(function (issues)
		{
			var result=[];
			for( var i = 0; i < issues.length; i++ )
			{
				getAMileStone(owner, repo, issue.milestone.number).then(function(milestone){

				});

			}
			/*var issuesWithMileStones = _.reject(issues,function(issueVar){ return issueVar.milestone == null; });

			for( var i = 0; i < issuesWithMileStones.length; i++ )
			{
				var name = issuesWithMileStones[i].milestone.number;
				resSet.push(name);
			}
			var resSet=[];
			//extracting issues with milestones
			var issuesWithAssignee =  _.reject(issues,function(issueVar){ return issueVar.assignee == null; });




			resolve(result);
		});
	});
}
*/

// How many words in an issue's title version an issue's body?
function titleBodyWordCountRatio(user,repo,number)
{
	return new Promise(function (resolve, reject)
	{
		// mock data needs list of issues.
		github.getAnIssue(user,repo,number).then(function (issue)
		{
			var titleWords = issue.title.split(/\W+|\d+/).length;
			var bodyWords  = issue.body.split(/\W+|\d+/).length;
			if( issue.body == "" )
			{
				resolve("NA");
				// HINT: http://stackoverflow.com/questions/4964484/why-does-split-on-an-empty-string-return-a-non-empty-array
			}
			//console.log( titleWords, bodyWords, issue.body);
			var str = ( titleWords / bodyWords ) + "";
			resolve(str);
		});
	});
}

exports.getIssuesAssigedToAuser = getIssuesAssigedToAuser;
exports.findMostFrequentAssignee = findMostFrequentAssignee;
exports.countOpen = countOpen;
exports.getFreeDevelopers=getFreeDevelopers;
exports.titleBodyWordCountRatio = titleBodyWordCountRatio;
