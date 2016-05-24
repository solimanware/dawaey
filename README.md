# myApp
IONIC with prepopulated sqlite database
## Installation 
first step
```
ionic start myApp tabs
```
second step > move the www folder into the IONIC project

3rd step After clone the project, you need to add your platform and ngCordova's SQLite plugin:
```
cordova plugin add https://github.com/litehelpers/Cordova-sqlite-storage.git
cordova plugin add https://github.com/an-rahulpandey/cordova-plugin-dbcopy.git
ionic platform add android
```
Then go on you will need an Emulator or real device to test the application



