/*
README:
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

*/

const fs = require('fs')
const path = require('path')

const readdir = dir => new Promise((resolve, reject) => fs.readdir(dir, (err, data) => err ? reject(err) : resolve(data)))

const readfile = file => new Promise((resolve, reject) => fs.readFile(file, 'utf-8', (err, data) => err ? reject(err) : resolve(data)))

const writefile = (dir, data) => new Promise((resolve, reject) => fs.writeFile(dir, data, err => err ? reject(err) : resolve()))

const isDirectory = path => new Promise((resolve, reject) => fs.lstat(path, (err, stats) => err ? reject(err) : resolve(stats.isDirectory())))

let c1 = 0
let c2 = 0

const index = (dir, dict) => {
	readdir(dir).then(files => {
		files.forEach(file => {
			const fp = path.join(dir, file)
			isDirectory(fp).then(x => {
			if(x){
				console.log("Subfolder found")
				return index(fp, dict)
			}
			else if (fp.indexOf('.txt') == fp.length - 4){
				console.log("Text file found")
				c1++
				readfile(fp).then(data => {
					let lines = data.split('\n')
					let i = 0
					let j = 0
					for(i = 0; i < lines.length; i++){
						let words = lines[i].split(' ')
						let col = 0
						for(j = 0; j < words.length; j++ ){
							if(words[j].length > 3){
								if(dict[words[j]]){
									dict[words[j]].push({"file" : fp, "line" : [i+1, col+1]})
								}
								else{
									dict[words[j]] = []
									dict[words[j]].push({"file" : fp, "line" : [i+1, col+1]})
								}
							}
							col += words[j].length + 1
						}
					}
					console.log("File parsed")
					c2++
					if(c1 == c2){
						writefile(process.argv[3], JSON.stringify(dict, null, 2))
					}
				})
			}
			})	
		})
	})
}

const parser = file => new Promise((resolve,reject) => {let dict = JSON.parse(file); resolve(dict)})

if(process.argv[2] == 'index'){
	const dict = {}
	index(process.argv[4], dict)
}
else if(process.argv[2] == 'search'){
	readfile(process.argv[3]).then(data => {
		parser(data).then(dict => {
			let x = process.argv[4]
			words = x.split(',')
			words[0] = words[0].substr(1)
			words[words.length - 1] = words[words.length - 1].slice(0,-1)	
			words.forEach(word => {
				if(dict[word]){
					dict[word].forEach(entity => {
						readfile(entity["file"]).then(content => {
							let lines = content.split('\n')
							let nline = entity["line"][0]
							let nword = entity["line"][1]
							console.log("word: " + word + ' file: ' + entity["file"] + ' line: '+ nline + ' : '  + lines[nline-1] )
						})
					})
				}
			})
		})
	})
}