# cs458-midterm Repository
Midterm project for cs458 at OSU.

## Setting up the Repository
In case anyone is unfamiliar with git, this how you clone the repo to your machine

     git clone https://github.com/dlkulp/cs458-midterm
This will put the repo in a folder called `cs458-midterm` and from there you'll call your standard git commands
* `git add [file]` 
* `git commit -m "commit message"`
* `git push`
* `git pull`

*Another Note: Please feel free to create new branches if you would like to test something out!  No reason to make everyone suffer through your testing!*

## Using Node.js and NPM
First things first, make sure you have both Node.js and NPM installed on your local machine.  Use google and you'll find what you need.  Once that's installed follow these commands to get your environment set up:
1. `sudo npm install -g grunt-cli`
2. `npm install`
3. `npm run build`
3. `npm start`

*Note: You do not need to kill node and restart it when you make changes to a file unless it is the server file.*  Simply save any files you've modified and hit `f5` in the browser. 

That's it for now.  At this point you should see "App listening on http://localhost:[PORT]", type `http://localhost:[PORT]` in a browser and you should see the app!
