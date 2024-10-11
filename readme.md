Notes for jiyoung:

- use node 22 for consistency
- https://github.com/kaoaaron/AsianAPI/blob/main/readme.md for endpoint usage
- runs on port 3000 with npm run start

Can get rid of all of App.js content.

I want a start page, with a single player and play with friends button.
Play with friends will be disabled for now until web sockets are added
single player button should open up a menu with game options. for now lets just let them select the number of people they want to guess, and also let them select guy, girl, or both for the quiz

once these options are selected, lets make a ui with the image that we grab randomly. and randomize 3 options together with the correct ethnicity.

this will be a good start

also add room on the options screen to allow the user to select an age range they want to guess. maybe we could use a mui slider or something. prob need updates in the backend so we can filter for this
