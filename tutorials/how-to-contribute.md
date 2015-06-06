## How to Contribute

This is a simple 3 step guide how to contribute to core orion packages.

###1. Fork the orion repo

Fork the repo https://github.com/orionjs/orion

Create a folder _orionjs_ somewhere on your hard drive and cd into it, then clone your fork:

`git clone https://github.com/<your-account>/orion`

That's it, you have a fork that you can edit!

Optionally, set _upstream_, so you can fetch from original repo into your fork whenever there are some changes there. Here is more info on how to do that:
https://help.github.com/articles/syncing-a-fork/


###2. Set up a working project 

To see the changes you make in your fork, you need a working project based on the packages from your fork. I simply use the blog example from orion-examples.

Inside your _orionjs_ folder clone the examples repo.

`git clone https://github.com/orionjs/examples.git`

Your folder structure should now look like this:


-orionjs  
--orion  
--examples  
---blog  


Let your blog project use your fork's packages and not the original orion packages and run the project.

`cd examples/blog`  
`export PACKAGE_DIRS=/<path>/orionjs/orion/packages`  
`meteor`  

(You may also want to set the env var in your .bash_profile to have it always ready.)

That's it! Make some changes somewhere in the packages (e.g. packages/bootstrap), and you will see them in your running blog project. Continue working, commit back to your fork, others can work on your fork too, and when you're ready to merge your work into the main project, go to step 3. 


###3. Send a Pull Request when ready 

Here's a very good guide, no more words are necessary. Just make sure NOT to send PR into main branch, ask around what is the current working branch.

https://help.github.com/articles/using-pull-requests/














