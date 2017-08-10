var basicCard = require('./BasicCard.js');
var clozeCard = require('./ClozeCard.js')
var inquirer = require("inquirer")
var fs = require("fs")
var jsonfile = require("jsonfile")

var basicCardList = require("./basicCards.json")
var clozeCardList = require("./clozeCards.json")

// Tested - basicCard and clozeCard working!!!

// Basic Card Test
// var georgeWashingtonCard = new basicCard("George Washington","First President of USA")
// console.log(georgeWashingtonCard.front)
// console.log(georgeWashingtonCard.back)

// Cloze Card Test
// var georgeWashingtonCloze = new clozeCard("George Washington was the first president of the USA", "John Adams")
// console.log(georgeWashingtonCloze.cloze)
// console.log(georgeWashingtonCloze.fullText)
// console.log(georgeWashingtonCloze.partial)

// Front-end (Inquirer)

function createCards() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which type of card would you like to create?",
                choices: ["Basic", "Cloze", "Exit"],
                name: "cardChoice"
            },
        ])
        .then(function (response) {
            if (response.cardChoice === "Basic") {
                createBasicCard()
            } else if (response.cardChoice === "Cloze") {
                createClozeCard()
            } else {
                // If exit was selected...
                process.exit()
            }
        })
}

function createBasicCard() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the text for the FRONT of the Basic Card here:",
                name: "basicFront"
            },
            {
                type: "input",
                message: "Enter the text for the BACK of the Basic Card here:",
                name: "basicBack"
            },
        ])
        .then(function (response) {
            var newCard = {
                front: response.basicFront,
                back: response.basicBack,
            }
            var file = './data.json'
            jsonfile.readFile(file, function (err, obj) {
                console.dir(obj)
                obj.cards.basic_card.push(newCard)
                console.log(obj.cards.basic_card)
                jsonfile.writeFile("./data.json", obj, function(err) {
                    console.error(err)
                })
            })


            // // read file into variable (string)
            // JSON.parse string to new variable (object)
            // update this object
            // JSON.stringify updated object (string)
            // save new string to file (you can overwrite, since all is in new object)

        })
}

createCards()