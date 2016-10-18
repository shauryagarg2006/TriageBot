## Use Cases 

####1/ Give me list of open issues to work.

A. Preconditions:
User must have Slack/Github API tokens on their system.

B. MainFlow:
User will request for list of open issues that they can work on. Bot will provide list of issues and the user would select one of them. That issue is assigned to the user now.

C. Subflow:
[S1] User will request for open issues to work.
[S2] Bot will return list of issues. User selects one of them.
[S3] Bot assigns that issue to the user.

D. Alternative Flow:
[A1] No open issues available to work on.

####2/Use Case: Give me this person’s(name of person) deadlines.

A. Preconditions:
User must have Slack/Github API tokens on their system.
The name of the person should exist in the repository as a collaborator.

B. MainFlow:
The user will ask for another user’s deadlines. A list of issues sorted with the most short deadline will be showed to the user.

C. Subflow:
[S1] Get a list of issues [S2] and then do [S3]
[S2] Return a list of open issues assigned to the person whose name is supplied by the user.
[S3] Sort a list of issues according to the “deadline” milestone.

D. Alternative Flow:
[A1] No open issues assigned  to the person whose name is supplied by the user. In that case bot will simple reply the user has no open issues.



####3/Use Case: Help me with this issue.

A. Preconditions:
User must have Slack/Github API tokens on their system.
User must have the specified issue assigned to them

B. Main-Flow
The user will ask for help with an issue assigned to them [S1]. They’ll receive a list of developers who have experience dealing with these types of issues. They can pick one of them [S2], and the bot will send a message to the developer informing them of the user’s need for assistance. [S3]

C. Sub-Flow
[S1] User will issue a help command with issue # to the bot.
[S2] Bot will return a list of developers who have experience dealing with similar issues. The user will select one of them.
[S3]Send a message to the developer informing them of the needed assistance.

D. Alternative Flow
[E1] The issue is not assigned to the user.
[E2] No available developer with experience dealing with this issue. 


2 open issues (ask help on one)
1 closed issue (label on type)


-Use Cases
-Selenium Testing! 
-Screencast to demonstrate!

