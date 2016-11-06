var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var _ = require("underscore");
var stringSimilarity = require('string-similarity');
var github = require("./github.js");

// Return open/closed issues in a user's repo
function getMatchingIssues(user, repo, state)
{
	return new Promise(function (resolve, reject)
	{
		github.getIssues(user, repo).then(function (issues)
		{
			var states;
			if(state == "open"){
				states = _.where(issues, { state: "open"});
			} else {
				states = _.where(issues, { state: "closed"});
			}
			resolve(states);
		});
	});
}

// Assignes a user to an issue
function assignIssueToUser(owner, repo, issue, assigneeName)
{
	return new Promise(function(resolve, reject){
		github.assignIssue(owner, repo, issue, assigneeName).then(function(response){
			var assignedTo = response.body.assignee.login;
			var string = "Assigned "+issue+" to "+ (assignedTo == owner ? "you" : assignedTo);
			resolve(string);
		});
	});
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
				if(issueVar.state ==='open' || issueVar.assignees === 'null'){
					return true;
				}
				else
					return false;
			});
			var topIssue = [];
			var maxsimScore = 0;
			yissue = _.find(issues, function(issue){return issue.number == number;});
			if(!yissue){
				reject("No one can help you with something that does not exists");
			}
			else{
				var similarIssues = _.filter(closedIssues,function(issueVar){
				var similarityScore = stringSimilarity.compareTwoStrings(issueVar.title + " " + issueVar.body, yissue.title + " " + issueVar.body);
				if(similarityScore > 0.5){
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
			var result =[];
			yissuedl = [];

			if(!topIssue.length){
				reject("Sorry, couldn't find anyone to help you");
			}
			else{
				for(i=0;i < yissue.assignees.length;i++){
					yissuedl.push(yissue.assignees[i].login);
				}
				for(i = 0;i < topIssue[topIssue.length - 1].assignees.length;i++){
					result.push(topIssue[topIssue.length - 1].assignees[i].login);
				}
				result = _.difference(result, yissuedl);
				if(!result.length){
					reject("Sorry, couldn't find anyone to help you");
				}
				resolve("I think " + result.join(',') + " could help you");
			}
		}
	});
});
}

exports.getIssuesAssigedToAuser = getIssuesAssigedToAuser;
exports.assignIssueToUser = assignIssueToUser;
exports.getMatchingIssues = getMatchingIssues;
exports.getFreeDevelopers=getFreeDevelopers;
