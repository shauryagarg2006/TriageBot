var Promise = require("bluebird");
var _ = require("underscore");
var request = require("request");
var querystring = require('querystring');
var token = "token " + process.env.GTOKEN;
var urlRoot = "https://github.ncsu.edu/api/v3";

var chai = require("chai");
var expect = chai.expect;
var nock = require("nock");

// Load mock data
var data = require("../mock.json");
var mockService = nock("https://github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/api/v3/repos/hqtu/TriageBotTesting/issues?state=all")
    .reply(200, JSON.stringify(data.issuesList) );

function getRepos(userName)
{
	var options = {
		url: urlRoot + '/users/' + userName + "/repos",
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};

	return new Promise(function (resolve, reject)
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body)
		{
			var repos = JSON.parse(body);
			resolve(repos);
			console.log(repos);
		});
	});
}

function getIssues(owner, repo)
{
	var url = "/repos/" + owner + "/" + repo + "/issues";
	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/issues?state=all",
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};


	return new Promise(function (resolve, reject)
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body)
		{
			var obj = JSON.parse(body);
			resolve(obj);
		});
	});
}


function getAnIssue(owner, repo, number )
{
	var options = {
		url: urlRoot + "/repos/" + owner +"/" + repo + "/issues/"+number,
		method: 'GET',
		headers: {
			"content-type": "application/json",
			"Authorization": token
		}
	};

	return new Promise(function (resolve, reject)
	{
		// Send a http request to url and specify a callback that will be called upon its return.
		request(options, function (error, response, body)
		{
			var obj = JSON.parse(body);
			resolve(obj);
		});
	});
}

exports.getRepos = getRepos;
exports.getIssues = getIssues;
exports.getAnIssue = getAnIssue;
