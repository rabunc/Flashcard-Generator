var basicCard = require('./BasicCard.js');
var clozeCard = require('./ClozeCard.js')
var inquirer = require("inquirer")
var fs = require("fs")
var jsonfile = require("jsonfile")

var data = require("./data.json")


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

function showMenu() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which of the following would you like to do?",
                choices: ["Create Cards", "Show Cards", "Exit"],
                name: "menuChoice"
            },
        ])
        .then(function (response) {
            if (response.menuChoice === "Create Cards") {
                createCards()
            } else if (response.menuChoice === "Show Cards") {
                reviewCards()
            } else {
                // If exit was selected...
                process.exit()
            }
        })
}


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
                jsonfile.writeFile("./data.json", obj, function (err) {
                    console.error(err)
                })
                showMenu()
            })



            // // read file into variable (string)
            // JSON.parse string to new variable (object)
            // update this object
            // JSON.stringify updated object (string)
            // save new string to file (you can overwrite, since all is in new object)

        })
}

function createClozeCard() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Enter the full text of the card here:",
                name: "fullText"
            },
            {
                type: "input",
                message: "Enter the CLOZE (part to be omitted) here:",
                name: "cloze"
            },
        ])
        .then(function (response) {
            var newCard = {
                fullText: response.fullText,
                cloze: response.cloze,
            }
            var file = './data.json'
            jsonfile.readFile(file, function (err, obj) {
                console.dir(obj)
                obj.cards.cloze_card.push(newCard)
                console.log(obj.cards.cloze_card)
                jsonfile.writeFile("./data.json", obj, function (err) {
                    console.error(err)
                })
                showMenu()
            })
        })
}

function reviewCards() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Which type of card would you like to review?",
                choices: ["Basic", "Cloze", "Exit"],
                name: "reviewChoice"
            },
        ])
        .then(function (response) {
            if (response.reviewChoice === "Basic") {
                reviewBasicCard()
            } else if (response.reviewChoice === "Cloze") {
                reviewClozeCard()
            } else {
                // If exit was selected...
                process.exit()
            }
        })
}

// variable that holds the basic card questions list
var basicCardList = data.cards.basic_card;
var basicQuestions = [];

for (i = 0; i < basicCardList.length; i++) {
    var q = new basicCard(basicCardList[i].front, basicCardList[i].back)
    basicQuestions.push(q)
}
// now we have an array of BasicCards with .front and .back properties
// let's show the user the front and require + check input of user for back


var currentQuestion = 0;
var answerRight = 0;
var answerWrong = 0;

function reviewBasicCard() {
    inquirer
        .prompt([
            {
                type: "input",
                message: basicQuestions[currentQuestion].front + "\nAnswer:",
                name: "userGuess"
            }
        ])
        .then(function (answers) {
            console.log("\n")

            if (answers.userGuess.toLowerCase() === basicQuestions[currentQuestion].back.toLowerCase()) {
                answerRight++
                console.log("Correct answer!")
            } else {
                answerWrong++
                console.log("Incorrect answer!")
            }
            console.log("Question: " + basicQuestions[currentQuestion].front + "\n")
            console.log("Answer: " + basicQuestions[currentQuestion].back + "\n")

            if (currentQuestion < basicQuestions.length - 1) {
                currentQuestion++
                reviewBasicCard()
            } else {
                console.log("Game Over!")
                console.log("Correct Answers: " + answerRight)
                console.log("Incorrect Answers: " + answerWrong)
                console.log("---------------------------------\n")

                inquirer
                    .prompt([
                        {
                            type: "confirm",
                            message: "Would you like to review cards again?",
                            name: "playAgain"
                        }
                    ])
                    .then(function (answers) {
                        if (answers.playAgain) {
                            currentQuestion = 0;
                            answerRight = 0;
                            answerWrong = 0;
                            reviewBasicCard()
                        } else {
                            console.log("Thanks for playing!")
                            currentQuestion = 0;
                            answerRight = 0;
                            answerWrong = 0;
                            process.exit()
                        }
                    })
            }
        })
}

var clozeCardList = data.cards.cloze_card;
var clozeQuestions = [];

for (i = 0; i < clozeCardList.length; i++) {
    var q = new clozeCard(clozeCardList[i].fullText, basicCardList[i].cloze)
    clozeQuestions.push(q)
}

function reviewClozeCard() {
    inquirer
        .prompt([
            {
                type: "input",
                message: clozeQuestions[currentQuestion].partial + "\nAnswer:",
                name: "userGuess"
            }
        ])
        .then(function (answers) {
            console.log("\n")

            if (answers.userGuess.toLowerCase() === clozeQuestions[currentQuestion].cloze.toLowerCase()) {
                answerRight++
                console.log("Correct answer!")
            } else {
                answerWrong++
                console.log("Incorrect answer!")
            }
            console.log("Answer: " + clozeQuestions[currentQuestion].fullText + "\n")
            if (currentQuestion < clozeQuestions.length - 1) {
                currentQuestion++
                reviewBasicCard()
            } else {
                console.log("Game Over!")
                console.log("Correct Answers: " + answerRight)
                console.log("Incorrect Answers: " + answerWrong)
                console.log("---------------------------------\n")

                inquirer
                    .prompt([
                        {
                            type: "confirm",
                            message: "Would you like to review cards again?",
                            name: "playAgain"
                        }
                    ])
                    .then(function (answers) {
                        if (answers.playAgain) {
                            currentQuestion = 0;
                            answerRight = 0;
                            answerWrong = 0;
                            reviewClozeCard()
                        } else {
                            console.log("Thanks for playing!")
                            currentQuestion = 0;
                            answerRight = 0;
                            answerWrong = 0;
                            process.exit()
                        }
                    })
            }
        })
}


showMenu()