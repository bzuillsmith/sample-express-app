Express 4 Sample App
====================

Feel free to peruse, use, modify, create issues, etc. The following sections are instructions on how to use the project. I'll be making updates to it as I have time and learn more so come back later for more!

Do This Once
============
Be certain you have installed grunt-cli globally (you only need to do this once). This is a build-script program
that will help run the sample application.

```npm install -g grunt-cli```

Also, for steps 2 and on, you will need to have a running instance of mongodb. Download 
and install mongodb. Run it in a separate terminal window with

```mongod ```

You can just leave it running while you play with various steps.

Do This Each Step
=================
Each major step is tagged as below. You can also list the tags by typing ```git tag```. An example of checking out step-0, the Hello World example is:

```git checkout step-0```

At each step, be sure to npm install so you know you have all the required dependencies. This
isn't strictly necessary each time, but if you see some missing module errors, odds are you need
to npm install.

```npm install```

For step-0, use ```node app``` to run it. For all other steps, run the app with grunt

```grunt ```

Steps
=====
* step-0 Hello world example
* step-1 A few more routes and example of simple logging middleware
* step-2 Added bootstrap for some quick and easy styling
* step-3 An almost complete app. Only thing really missing is authentication
