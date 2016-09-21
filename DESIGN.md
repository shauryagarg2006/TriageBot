#Design Milestone

###Problem Statement

There is a friction involved in allocating tasks to software developers when working with any project involving multiple members. Why is task allocation a problem? Here are some of the common challenges that hinder project management: 

  - A lot of time that is wasted in manually browsing and delegating the tasks appropriate to the developer team members.
  - Reassigning a task to the next available developer so they can resume the task quickly
  - Making sure all developers have at least one task to do at all times to keep the project moving (easy)
  - Give the developer tasks sorted by priority according to the current sprint deadline (relatively easy)

These challenges need to be addressed so that software developers can work efficiently and effectively.

### Bot Description 

The bot is designed to solve the challenges that were listed above in order to allocate tasks efficiently and appropriately to the developers that can resolve the issues or complete the tasks in a reasonable time. To reduce time wasted in manually looking up issues and assigning them to the appropriate developers, the bot will allow the developer to fetch a list of issues sorted by priority. Reassigning a task to the next available developer will also be easy since the bot will have a list of developers who haven’t been assigned any issues. This will also takes care of the problem of keeping developers productive by having at least one task to do at all times. A related issue that the bot will solve is making sure developers are working on higher priority issues for the current spring, and according to the kinds of issues that they are skilled at solving. The bot will also provide a functionality to match the issues and the developers based on their past experiences.

A bot is a good solution for several reasons: a bot can automatically process background tasks that are tedious for the developers; a bot can converse with the developers to do things step by step in real time, which provides the developer flexibility in assigning tasks or taking on tasks proactively; it’s a natural interface than simply running scripts on a terminal which provides an easier way to execute commands and makes them more memorable. This bot would best fit into the DevOps bot category since it is handling common developer tasks.


### Design Sketches 
Mock a chat with Bash’s fake profile image with some common commands:

- Assign issue to developer
- Get back list of issues sorted by priority
- Talk to Dr.Parnin regarding wireframe mockup.

#####Storyboard: 

Interactive chat:
- Give me deadlines
- What are the issues assigned xyz?
- Is there are any work for me?
- I need help on this issue [blah blah]

Notifications:
- You have an issue with a deadline approaching.
- You have been assigned an issue, can you work on this?
- This issue [blah blah] has been updated.

Constraints or guidelines that should be established in building software for your architecture:
- The act of closing an issue means they solved it
- The type of priority of issues include high, medium and low 
- Priority level of issues is calculated on deadlines and git issue’s label(s)
- There are fixed number of labels.
- Each individual issue is assigned appropriate label(s) by the developer(s).



### Architecture Design 

Front-end: Slack

Back-end: Github API calls, Slack API calls, Machine Learning, Github 


### Additional Patterns 
