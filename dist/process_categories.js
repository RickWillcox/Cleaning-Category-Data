"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RawCategories_1 = require("./RawCategories");
const extract = require("extract-lemmatized-nonstop-words");
// The processing array will have two different "columns",
// the index 0 in the array will be the processing word,
// and the index 1 will be the raw data. (never changes, so we can map to it later)
// eg [["shoe", "ShoeS 100%"], ["shirt", "SHIRTS"]]
// This just makes an array of arrays that duplicates the list item into index 1 so we can map back to it later
function makeArrayOfArrays(array) {
    let processingArray = [];
    array.map((item) => processingArray.push([item, item]));
    return processingArray;
}
// sets processing index to lowercase
function arrayToLowerCase(array) {
    for (let i = 0; i < array.length; i++) {
        array[i][0] = array[i][0].toLowerCase();
    }
    return array;
}
function arrayRemoveAllNonLetters(array) {
    for (let i = 0; i < array.length; i++) {
        array[i][0] = array[i][0].replace(/[^a-z ]/gi, ""); //there is a space after the z to not remove spaces
    }
    return array;
}
function arrayRemoveDuplicates(array) {
    return [...new Set(array)];
}
function arraySplitWords(array) {
    const toRemove = new Set(["", ",", " "]);
    const elementsToRemove = [];
    var returnArray = [];
    for (let i = 0; i < array.length; i++) {
        let splitCategory = array[i][0].split(/[\s/]+/);
        if (splitCategory.length > 1) {
            let newCategory = splitCategory.filter((x) => !toRemove.has(x));
            splitCategory.map((category) => returnArray.push([category, array[i][1]]));
        }
        else {
            returnArray.push([array[i][0], array[i][1]]);
        }
    }
    return returnArray;
}
function arrayRemoveEmptyElements(array) {
    var returnArray = [];
    for (let i = 0; i < array.length; i++) {
        if (!(array[i][0] === "" || array[i][0] === " ")) {
            returnArray.push(array[i]);
        }
    }
    return returnArray;
}
function arrayRemoveDuplicatesToDict(array) {
    var returnDict = {};
    for (let i = 0; i < array.length; i++) {
        // if the key doesnt exists, create it and add raw category
        if (!returnDict[array[i][0]]) {
            returnDict[array[i][0]] = [array[i][1]];
        }
        else {
            returnDict[array[i][0]].push(array[i][1]);
        }
    }
    //check if key exists
    return returnDict;
}
// function dictRemovePlurals(dictionary: Object) {
//     const keysArray: string[] = Object.keys(dictionary);
//     const keysToRemove: string[] = [];
//     for (let i = 0; i < keysArray.length; i++) {
//         // does this word end in "s"?
//         if (keysArray[i].slice(-1) === "s") {
//             // does this word minus s exist as a key? (is it a plural shoes > shoe)
//             // @ts-ignore
//             if (!!(dictionary[(keysArray[i].slice(-1))])){
//                 //non plural key exists
//                 dictionary[sWord].concat(dictionary[keysArray[i]]);
//                 keysToRemove.push(keysArray[i]); //this key was merged so we remove it later from the main dictionary
//             } else if{
//                 if (!!(dictionary[(keysArray[i].slice(-2))])){
//                     //non plural key exists
//                     dictionary[sWord].concat(dictionary[keysArray[i]]);
//                     keysToRemove.push(keysArray[i]); //this key was merged so we remove it later from the main dictionary
//             }
//             try {
//                 // if (!!dictionary[""])
//                 // @ts-ignore
//             } catch {
//                 // key -s doesnt exist
//                 // maybe its ES like (Dresses > Dress)
//                 try {
//                     var esWord: String = Object.keys(
//                         inProcessingDict[keysArray[i]]
//                     ).slice(0, -2)[0];
//                     //non plural key exists
//                     // @ts-ignore
//                     dictionary[sWord].concat(dictionary[keysArray[i]]);
//                     keysToRemove.push(keysArray[i]); //this key was merged so we remove it later from the main dictionary
//                 } catch {
//                     // key -s doesnt exist, likely just a word that ends in s that isnt a plural
//                     // Do nothing
//                 }
//             }
//         }
//     }
//     // remove all the s and es we merged already
//     for (let i = 0; i < keysToRemove.length; i++) {
//         // @ts-ignore
//         delete dictionary[keysToRemove[i]];
//     }
//     return dictionary;
// }
// Process flow
var inProcessingArray = [];
inProcessingArray = makeArrayOfArrays(RawCategories_1.rawCategories);
inProcessingArray = arrayToLowerCase(inProcessingArray);
inProcessingArray = arraySplitWords(inProcessingArray);
inProcessingArray = arrayRemoveAllNonLetters(inProcessingArray);
inProcessingArray = arrayRemoveEmptyElements(inProcessingArray);
// Convert to Dict to remove duplicates in index 1 and keep what they were originally
var inProcessingDict = {};
inProcessingDict = arrayRemoveDuplicatesToDict(inProcessingArray);
// console.log(inProcessingDict);
// dictRemovePlurals explanation
const a = {
    shoe: ["a", "b", "c"],
    shoes: ["d", "e", "f"],
    dress: ["a"],
    dresss: ["b"],
    dresses: ["c"],
    coat: ["a", "b"],
};
// console.log(dictRemovePlurals(a));
// console.log(a["shoes"].slice(0, -1));
// dictionary[(keysArray[i].slice(-1))]
// console.log(!!a["shoesss"]);
console.log("TEST".slice(0, 1));
console.log("TEST".slice(0, -1));
console.log("TEST".slice(1, -1));
// console.log("TEST".slice(1, 1));
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
