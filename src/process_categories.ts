// @ts-nocheck

import { rawCategories, testCategories } from './RawCategories';
const extract = require('extract-lemmatized-nonstop-words');
var fs = require('fs');

// The processing array will have two different "columns",
// the index 0 in the array will be the processing word,
// and the index 1 will be the raw data. (never changes, so we can map to it later)
// eg [["shoe", "ShoeS 100%"], ["shirt", "SHIRTS"]]

// This just makes an array of arrays that duplicates the list item into index 1 so we can map back to it later
function makeArrayOfArrays(array: string[]) {
    let processingArray: string[][] = [];
    array.map((item) => processingArray.push([item, item]));
    return processingArray;
}

// sets processing index to lowercase
function arrayToLowerCase(array: string[][]): string[][] {
    for (let i = 0; i < array.length; i++) {
        array[i][0] = array[i][0].toLowerCase();
        array[i][1] = array[i][1].toLowerCase();
    }
    return array;
}

function arrayRemoveAllNonLetters(array: string[][]): string[][] {
    for (let i = 0; i < array.length; i++) {
        array[i][0] = array[i][0].replace(/[^a-z ]/gi, ''); //there is a space after the z to not remove spaces
    }
    return array;
}

function arrayRemoveDuplicates(array: any[]) {
    return [...new Set(array)];
}

function arraySplitWords(array: string[][]): string[][] {
    const toRemove = new Set(['', ',', ' ']);
    const elementsToRemove: number[] = [];
    var returnArray: string[][] = [];
    for (let i = 0; i < array.length; i++) {
        // let splitCategory = array[i][0].split(/[\s/\-\_\#]+/);
        let splitCategory = array[i][0].split(/[^A-Za-z]+/);
        if (splitCategory.length > 1) {
            let newCategory: string[] = splitCategory.filter(
                (x) => !toRemove.has(x)
            );
            splitCategory.map((category) =>
                returnArray.push([category, array[i][1]])
            );
        } else {
            returnArray.push([array[i][0], array[i][1]]);
        }
    }
    return returnArray;
}

function arrayRemoveEmptyElements(array: string[][]): string[][] {
    var returnArray: string[][] = [];
    for (let i = 0; i < array.length; i++) {
        if (!(array[i][0] === '' || array[i][0] === ' ')) {
            returnArray.push(array[i]);
        }
    }
    return returnArray;
}

function arrayRemoveDuplicatesToDict(array: string[][]): Object {
    var returnDict: any = {};
    for (let i = 0; i < array.length; i++) {
        // if the key doesnt exists, create it and add raw category
        if (!returnDict[array[i][0]]) {
            returnDict[array[i][0]] = [array[i][1]];
        } else {
            returnDict[array[i][0]].push(array[i][1]);
        }
    }
    //check if key exists
    return returnDict;
}

function dictRemovePlurals(dictionary: Object) {
    const keysArray: string[] = Object.keys(dictionary);
    const keysToRemove: string[] = [];
    for (let i = 0; i < keysArray.length; i++) {
        // does this word end in "s"?
        let word: string = keysArray[i];
        let isS: boolean = keysArray[i].slice(-1) === 's' ? true : false;
        let isES: boolean = keysArray[i].slice(-2) === 'es' ? true : false;
        let wordMinusS: string = keysArray[i].slice(0, -1);
        let wordMinusES: string = keysArray[i].slice(0, -2);
        if (isS) {
            // Does this word minus S exist as a key
            if (!!dictionary[wordMinusS]) {
                dictionary[wordMinusS] = dictionary[wordMinusS].concat(
                    dictionary[word]
                );
                keysToRemove.push(word); //this key was merged so we remove it later from the main dictionary
            } else if (isES) {
                // Does this word minus ES exist as a key
                // word does end in "es" eg dresses
                if (!!dictionary[wordMinusES]) {
                    dictionary[wordMinusES] = dictionary[wordMinusES].concat(
                        dictionary[word]
                    );
                    keysToRemove.push(word); //this key was merged so we remove it later from the main dictionary
                }
            }
        }
    }

    keysToRemove.forEach((word) => {
        delete dictionary[word];
    });
    return dictionary;
}

function dictRemoveDupeValues(dictionary: Object) {
    for (const key in dictionary) {
        let tempArray: string[] = dictionary[key];
        tempArray = arrayRemoveDuplicates(tempArray);
        dictionary[key] = tempArray;
    }
    return dictionary;
}

function logUniqueCategoriesArray(
    lastFunctionRun: string,
    x: Object | string[][]
) {
    try {
        // if this fails its an object
        //@ts-ignore
        x[0].constructor === Array;
        console.log(lastFunctionRun, x.length);
    } catch {
        console.log(lastFunctionRun, Object.keys(x).length);
    }
}

function saveProcessedDataToJson(processedData: Object) {
    const jsonProcessedData = JSON.stringify(processedData);
    fs.writeFile('processed_data.json', jsonProcessedData, function (err: any) {
        if (!err) {
            console.log('processed_data.json Saved!');
        }
    });
}

function deleteOldJsonFile() {
    //unused as overwriting keeps my formatting
    fs.unlink('processed_data.json', function (err: any) {});
}

function processDirtyData() {
    // Process flow
    const RAW_CATEGORY_SET = testCategories; // set to rawCategories for real processing
    var inProcessingArray: string[][] = [];

    deleteOldJsonFile();

    inProcessingArray = makeArrayOfArrays(RAW_CATEGORY_SET);

    // console.log('Step 1: ', inProcessingArray);

    logUniqueCategoriesArray(
        'Raw Categories -----------------------',
        inProcessingArray
    );

    // console.log('Step 2: ', inProcessingArray);

    inProcessingArray = arrayToLowerCase(inProcessingArray);
    logUniqueCategoriesArray(
        'Lowercase everything -----------------',
        inProcessingArray
    );

    // console.log('Step 3: ', inProcessingArray);

    inProcessingArray = arraySplitWords(inProcessingArray);
    logUniqueCategoriesArray(
        'Split any category with multiple words',
        inProcessingArray
    );

    // console.log('Step 4: ', inProcessingArray);

    inProcessingArray = arrayRemoveAllNonLetters(inProcessingArray);
    logUniqueCategoriesArray(
        'Remove all categories that are numbers',
        inProcessingArray
    );

    // console.log('Step 5: ', inProcessingArray);

    inProcessingArray = arrayRemoveEmptyElements(inProcessingArray);
    logUniqueCategoriesArray(
        'Remove all empty that are numbers-----',
        inProcessingArray
    );

    // console.log('Step 6: ', inProcessingArray);

    // Convert to Dict to remove duplicates in index 1 and keep what they were originally
    var inProcessingDict: any = {};

    inProcessingDict = arrayRemoveDuplicatesToDict(inProcessingArray);
    logUniqueCategoriesArray(
        'Remove Dupes and convert to Obj ------',
        inProcessingDict
    );

    // console.log('Step 7: ', inProcessingDict);

    inProcessingDict = dictRemovePlurals(inProcessingDict);
    logUniqueCategoriesArray(
        'Remove all Plurals -------------------',
        inProcessingDict
    );

    // console.log('Step 8: ', inProcessingDict);

    inProcessingDict = dictRemoveDupeValues(inProcessingDict);
    logUniqueCategoriesArray(
        'Remove Duplicate Value for each key --',
        inProcessingDict
    );

    // console.log('Step 9: ', inProcessingDict);

    saveProcessedDataToJson(inProcessingDict);

    // console.log(inProcessingDict);
}

// Main function that runs all the other helper functions
processDirtyData();

// dictRemovePlurals explanation
// const a = {
//     shoe: ["a", "b", "c"],
//     shoes: ["d", "e", "f"],
//     dress: ["a"],
//     dresss: ["b"],
//     dresses: ["c"],
//     coat: ["a", "b"],
//     boat: ["a", "b"],
//     boats: ["c", "d"],
// };
// console.log(dictRemovePlurals(a))
// >>
// {
//   shoe: [ 'a', 'b', 'c', 'd', 'e', 'f' ],
//   dress: [ 'a', 'b', 'c' ],
//   coat: [ 'a', 'b' ],
//   boat: [ 'a', 'b', 'c', 'd' ]
// }

// arrayRemoveDuplicatesToDict explantion
// const a = [
//     ["shoes", "SHoeS"],
//     ["shoes", "shoeS11"],
//     ["top", "TOP"],
//     ["top", "top3"],
//     ["singlet", "Singlet"],
// ];
// console.log(arrayRemoveDuplicatesToDict(a));
// >>
// {
//     shoes: [ 'SHoeS', 'shoeS11' ],
//     top: [ 'TOP', 'top3' ],
//     singlet: [ 'Singlet' ]
//   }

// arrayRemoveAllNonLetters explanation
// const a = [
//     ["2", "REMOVE"],
//     ["hello", "KEEP"],
//     ["33", "REMOVE"],
//     ["world", "KEEP"],
// ];
// console.log(arrayRemoveAllNonLetters(a));
// [
//     [ '', 'REMOVE' ],
//     [ 'hello', 'KEEP' ],
//     [ '', 'REMOVE' ],
//     [ 'world', 'KEEP' ]
//   ]

// arrayRemoveEmptyElements explanation
// const a = [
//     ["", "REMOVE"],
//     ["hello", "KEEP"],
//     [" ", "REMOVE"],
//     ["world", "KEEP"],
// ];
// console.log(arrayRemoveEmptyElements(a));
// >>[ [ 'hello', 'KEEP' ], [ 'world', 'KEEP' ] ]

// arraySplitWords explanation
// const a = [
//     ["necklace", "Necklace"],
//     ["accessory", "Accessory"],
//     ["resort 21/22", "Resort 21/22"],
//     ["skirt", "SKIRT"],
//     ["ladies dress sandals/slides/mules", "LADIES DRESS SANDALS/SLIDES/MULES"],
// ];
// console.log(arraySplitWords(a));
// >>>>
// [
//     [ 'necklace', 'Necklace' ],
//     [ 'accessory', 'Accessory' ],
//     [ 'resort', 'Resort 21/22' ],
//     [ '21', 'Resort 21/22' ],
//     [ '22', 'Resort 21/22' ],
//     [ 'skirt', 'SKIRT' ],
//     [ 'ladies', 'LADIES DRESS SANDALS/SLIDES/MULES' ],
//     [ 'dress', 'LADIES DRESS SANDALS/SLIDES/MULES' ],
//     [ 'sandals', 'LADIES DRESS SANDALS/SLIDES/MULES' ],
//     [ 'slides', 'LADIES DRESS SANDALS/SLIDES/MULES' ],
//     [ 'mules', 'LADIES DRESS SANDALS/SLIDES/MULES' ]

//         } else if{
//             if (!!(dictionary[(keysArray[i].slice(-2))])){
//                 //non plural key exists
//                 dictionary[sWord].concat(dictionary[keysArray[i]]);
//                 keysToRemove.push(keysArray[i]); //this key was merged so we remove it later from the main dictionary
//         }

//         try {
//             // if (!!dictionary[""])

//             // @ts-ignore

//         } catch {
//             // key -s doesnt exist
//             // maybe its ES like (Dresses > Dress)
//             try {
//                 var esWord: String = Object.keys(
//                     inProcessingDict[keysArray[i]]
//                 ).slice(0, -2)[0];
//                 //non plural key exists
//                 // @ts-ignore
//                 dictionary[sWord].concat(dictionary[keysArray[i]]);
//                 keysToRemove.push(keysArray[i]); //this key was merged so we remove it later from the main dictionary
//             } catch {
//                 // key -s doesnt exist, likely just a word that ends in s that isnt a plural
//                 // Do nothing
//             }
//         }
//     }
// }
// // remove all the s and es we merged already
// for (let i = 0; i < keysToRemove.length; i++) {
//     // @ts-ignore
//     delete dictionary[keysToRemove[i]];
// }
// return dictionary;
