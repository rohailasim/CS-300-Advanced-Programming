Rohail Asim
19100169
CS 300 Assignment 3

The code is written and tested on node v8.10.0 on a Windows 10 machine and it is working without any problems.

The suggested possible approach algorithm given in the handout was followed for the most part.

For indexing, the directories are recursively checked for .txt files. when they are found, their words with length greater
than 3 are stored in the dictionary in the required format.

For searching, first the json file is parsed into a dictionary, then the dictionary is checked for 
the words and then the required file is read and the required line is printed.

Example calls: 
node searcher.js index jason.json dir
node searcher.js search jason.json ["Alice","green"]
