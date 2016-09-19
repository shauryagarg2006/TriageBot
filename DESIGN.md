<h3>Design Milestone</h3>

<h4>Problem Statement</h4>
There is a friction involved in allocating tasks to software developers when working with any project involving multiple members. Why is task allocation a problem? Here are some of the common challenges that hinder project management: 

<ul> <li> Determining the next available developer who can continue a task or start a new one </li>
<li> Determining the holistic developer’s skills easily </li>
<li> Determining the level of a difficulty of tasks to assign to an appropriate developer based on their skill level and expertise</li>
<li> Reassigning an old task to the next available developer so they can resume the task quickly</li>
<li> Making sure all developers have at least one task to do at all times to keep the project moving (easy)</li>
<li> Give the developer tasks sorted by priority according to the current sprint deadline (relatively easy)</li>
</ul>

These challenges need to be addressed so that software developers can work efficiently and effectively. There is a lot of time that is wasted in manually browsing and delegating the tasks appropriate to the developer team members.  

<h4> Bot Description </h4>
The bot is designed to solve the challenges that were listed above in order to allocate tasks efficiently and appropriately to the developers that can resolve the issues or complete the tasks in a reasonable time:   
<ul> <li> Find open issues on Github </li>
<li> Fetch issues based on priority/milestone/difficulty </li>
<li> Analyze developers’ skills </li>
<li> Analyze the difficulty levels of open tasks and issues </li>
<li> Conversate with the developer’s request to suggest open tasks/issues based on their skills/expertises </li>
<li> Follow the lead developer’s request to assign potential tasks/issues to the developers </li>
<li> Reminding the developers about open/unresolved issues based on the priority/milestone/difficulty level </li>
</ul>

A bot is a good solution for several reasons: a bot can automatically process background tasks that are tedious for the developers; a bot can converse with the developers to do things step by step in real time, which provides the developer flexibility in assigning tasks or taking on tasks; it’s a natural interface than simply running scripts on a terminal which provides an easier way to execute commands and makes them more memorable. This bot would best fit into the DevOps bot category since it is handling common developer tasks.

<h4> Design Sketches </h4>

<h4> Architecture Design </h4>

<h4> Additional Patterns </h4>


<h4> Brainstorming: </h4>

Slack + Git for Project Management (Triage):

<ul> <li> Keep track of milestones and remind developers about the deadlines </li>
<li> Give warnings about unassigned pull requests </li>
<li> Assign issues/pull-requests for developers </li>
<li> Give estimate about whether an additional feature is doable within time frame </li>
<li> If a developer leaves project, be able to reassign issues/pull-requests/branches etc. </li>
<li> Remove stale or unused branches </li> </ul>

Issues:

<ul> <li> Persistent storage of high level details: developer absence of leave etc. </li>
</ul>
