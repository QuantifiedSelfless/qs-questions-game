# qs-questions-game
Exhibit for Quantified Self - How well do you know yourself?

##Description 
This exhibit has the player answer a series of "this or that" style questions. After the first 10 questions, we reccomend answers for the next 20 questions based on survey data. If the player guesses wrong against this reccomendation, they are scolded.

##Ajax Call Location
The AJAX call for this exhibit is on line 284 of game/sketch.js. The 6060 port should be removed from line 287 when testing is finished.

##Running the Game
This exhibit is run by serving index.html. this can be done in the console with
```
python -m SimpleHTTPServer 8000

```

##Miscellaneous Notes
mock_answers is overwritten on a successful ajax call. It is hardcoded with a set of an answers as a fallback.
