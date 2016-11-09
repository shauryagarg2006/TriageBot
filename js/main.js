var Promise = require("bluebird");
var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");
var _ = require("underscore");
var stringSimilarity = require('string-similarity');
var github = require("./github.js");

var MAX_LABEL = 4;

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

// Use this to compare two sets of issues, where:
// issuesA is either the issue that needs help OR
// issuesA is a list of closed issues by developer who wants open issues and
// issuesB is the list of open or closed issues to compare against which will
// be sorted according by comparing each issue on issueA for highest score
// issuesB will then be returned once sorted from highest match to lowest
function sortAndCompareIssues(issuesA, issuesB)
{
	return new Promise(function(resolve, reject){
		var issuesRtn = [];
		var issueScore = [];
		for(var i = 0; i < issuesB.length; i++)
		{
			var issuesBLabels = _.pluck(issuesB[i].labels, 'name');
			var maxScore = 0;
			for(var j = 0; j < issuesA.length; j++)
			{
				var score = 0;
				var issuesALabels = _.pluck(issuesA[j].labels, 'name');
				var labelsDiff = _.difference(issuesALabels, issuesBLabels);
				// console.log("comparing "+issuesA[j].title+" with "+issuesB[i].title+" diff: "+labelsDiff);
				// If all labels match or if both issues don't have labels, add to score
				if(labelsDiff.length == 0 || (issuesALabels.length == 0 && issuesBLabels.length == 0)){
					if(issuesALabels.length <= MAX_LABEL)
					{
						score += (issuesALabels.length)*0.05;
					}
				} else {
					if(labelsDiff.length <= MAX_LABEL)
					{
						score += (issuesALabels.length-labelsDiff.length)*0.05;
					}
				}
				// console.log("label score "+score);
				var titleScore = stringSimilarity.compareTwoStrings(issuesB[i].title, issuesA[j].title);
				score += titleScore*0.5;
				var descScore;
				// console.log("title score "+titleScore);
				if(issuesA[j].body.length != 0 && issuesB[i].body.length != 0){
					descScore = stringSimilarity.compareTwoStrings(issuesB[i].body, issuesA[j].body);
					score += descScore*0.3;
					// console.log("desc score "+descScore);
				} else if(issuesA[j].body.length == 0 && issuesB[i].body.length == 0){
					score += 0.3;
				}
				issueScore.push(score);
				// console.log("total score for "+issuesB[i].title+" is "+score);
			}
		}
		// console.log("sorted "+issueScore);
		// Sort the issuesB and return
		var maxArray = []; // used to exclude the previous max for _.max below
		while(maxArray.length < issueScore.length)
		{
			var max = _.max(issueScore, function(num)
			{
				// only return num if it's a new max
				if(maxArray.indexOf(num) == -1) {
					return num;
				}
			});
			maxArray.push(max);
			// add the title of the issue that has the next max score
			issuesRtn.push(issuesB[issueScore.indexOf(max)]);
		}
		resolve(issuesRtn);
	});
}

// Assignes a user to an issue
function assignIssueToUser(currentUser, owner, repo, issue, assigneeName)
{
	return new Promise(function(resolve, reject){
		github.assignIssue(owner, repo, issue, assigneeName).then(function(response){
			var string = "Assigned "+issue+" to "+ (assigneeName == currentUser.git_name ? "you" : assigneeName);
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
			var states;

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

function getIssuesClosedByUser(owner,repo,userName)
{
	return new Promise(function (resolve, reject)
	{
		github.getClosedIssues(owner, repo).then(function (issues)
		{
			// console.log(issues);
			var issuesWithAssignee =  _.reject(issues,function(issueVar){
				if(issueVar.assignee == null || issueVar.state != 'closed')
				{
					return true;
				} else {
					return false;
				}
			});

			var issuesForAssignee = _.filter(issuesWithAssignee,function(issueVar){
				var assigneesArray = issueVar.assignees;
				for (i = 0; i < assigneesArray.length; i++){
					if(assigneesArray[i].login == userName){
						return true;
					}
				}
				return false;
			});
			if(!issuesForAssignee.length){
				reject("No closed issues found for ");
			}

			var result =[];
			for(i=0;i<issuesForAssignee.length;i++){
				result.push(issuesForAssignee[i].title);
				result.push(issuesForAssignee[i].html_url);
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
exports.getIssuesClosedByUser = getIssuesClosedByUser;
exports.assignIssueToUser = assignIssueToUser;
exports.getMatchingIssues = getMatchingIssues;
exports.getFreeDevelopers=getFreeDevelopers;
exports.sortAndCompareIssues = sortAndCompareIssues;
