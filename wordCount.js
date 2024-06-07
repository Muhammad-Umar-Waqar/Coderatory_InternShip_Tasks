const readline = require('readline');
const xml2js = require('xml2js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to generate the Fibonacci series (CallBacks)

function getFibonacciSeries(min, max, callback) {
    let n1 = 0;
    let n2 = 1;
    let result;
    let fibList = [];

    if (min === 0) {
        fibList.push(n1);
    }

    while (n1 <= max) {
        if (n1 >= min) {
            fibList.push(n1);
        }
        result = n1 + n2;
        n1 = n2;
        n2 = result;
    }

    callback(fibList);
}

// Function for user detection with match pool
const userObjects = [
    { Name: "Alice", Age: 25, ID: "A1" },
    { Name: "Bob", Age: 25, ID: "B1" },
    { Name: "Alice", Age: 30, ID: "A2" },
    { Name: "Charlie", Age: 35, ID: "C1" }
];

function addUser(name, age, id) {
    let foundDuplicate = false;

    userObjects.forEach(existingObj => {
        if (existingObj.Name.trim() === name.trim() && existingObj.Age === age && existingObj.ID === id) {
            foundDuplicate = true;
            console.log(`Duplicate user detected: ${JSON.stringify(existingObj)}`);
        }
    });

    if (!foundDuplicate) {
        const newUserObject = { Name: name, Age: age, ID: id };
        userObjects.push(newUserObject);
        console.log("User added:", newUserObject);
        console.log("Updated userObjects:", userObjects);
    }
}

async function processUserInput() {
    const name = await askQuestion("Enter Name: ");
    const age = await askQuestion("Enter Age: ");
    const id = await askQuestion("Enter ID: ");
    addUser(name, parseInt(age), id);
}

// Function for parts of speech detection
function posTaggerParagraph(paragraph, callback) {
    const sentences = paragraph.split('. ');
    return sentences.map(sentence => sentence.split(' ').map(callback));
}

function detectPOSForParagraph(word) {
    const lowerCaseWord = word.toLowerCase();
    if (["the", "a", "an", "my", "your", "his", "her", "its", "our", "their"].includes(lowerCaseWord)) return { word, pos: "Determiner" };
    if (["is", "am", "are", "was", "were", "be", "being", "been"].includes(lowerCaseWord)) return { word, pos: "Verb" };
    if (["hi", "hello", "bye", "goodbye"].includes(lowerCaseWord)) return { word, pos: "Interjection" };
    if (["i", "you", "he", "she", "it", "we", "they"].includes(lowerCaseWord)) return { word, pos: "Pronoun" };
    if (["and", "but", "or", "yet", "so", "for", "nor"].includes(lowerCaseWord)) return { word, pos: "Conjunction" };
    if (["in", "on", "at", "with", "from", "to", "of", "for", "by", "about", "as", "into", "like"].includes(lowerCaseWord)) return { word, pos: "Preposition" };
    if (["that", "which", "who", "whom", "whose", "what"].includes(lowerCaseWord)) return { word, pos: "Relative Pronoun" };
    if (["this", "these", "those", "that"].includes(lowerCaseWord)) return { word, pos: "Demonstrative Pronoun" };
    return { word, pos: "Noun" }; // Fallback POS
}

// Function for XML to JSON conversion

const parser = new xml2js.Parser();

function convertXmlToJson(xmlData) {
    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        const json = JSON.stringify(result, null, 4);
        console.log('JSON Output:\n', json);
    });
}

// Function for word counting

function countWords(paragraph) {
    const words = paragraph.split(" ");
    const wordCount = {};

    words.forEach(word => {
        const cleanedWord = word.trim().toLowerCase();
        wordCount[cleanedWord] = (wordCount[cleanedWord] || 0) + 1;
    });

    return wordCount;
}

// Utility function to ask a question and return user input
function askQuestion(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// IIFE Main Function Wrapping 

(async function (){
async function main() {
    console.log("Select a function:");
    console.log("1. Generate Fibonacci series");
    console.log("2. User detection with match pool");
    console.log("3. Detect parts of speech");
    console.log("4. Convert XML to JSON");
    console.log("5. Count words in a paragraph");

    const choice = parseInt(await askQuestion("Enter your choice (1-5): "));

    switch (choice) {
        case 1:
            const min = parseInt(await askQuestion("Enter the minimum value: "));
            const max = parseInt(await askQuestion("Enter the maximum value: "));
            getFibonacciSeries(min, max, (fibList) => {
                console.log("Fibonacci Series:", fibList);
                rl.close();
            });
            break;
        case 2:
            await processUserInput();
            break;
        case 3:
            const paragraph = await askQuestion("Enter a paragraph: ");
            console.log("Parts of Speech:", posTaggerParagraph(paragraph, detectPOSForParagraph));
            rl.close();
            break;
        case 4:
            let xmlData = '';
            console.log('Please enter your XML data (end with an empty line):');
            rl.removeAllListeners('line'); // Remove previous listeners
            rl.on('line', (input) => {
                if (input.trim() === '') {
                    rl.close();
                    convertXmlToJson(xmlData);
                } else {
                    xmlData += input + '\n';
                }
            });
            break;
        case 5:
            const inputParagraph = await askQuestion("Enter a paragraph: ");
            const wordFrequency = countWords(inputParagraph);
            console.log("Word Count:", Object.keys(wordFrequency).length);
            console.log("Word Frequencies:");
            Object.entries(wordFrequency).forEach(([word, count]) => {
                console.log(`${word}: ${count}`);
            });
            rl.close();
            break;
        default:
            console.log("Invalid choice. Please choose a number between 1 and 5.");
            rl.close();
    }
}

rl.on('line', () => {}); 
main();
}) ();