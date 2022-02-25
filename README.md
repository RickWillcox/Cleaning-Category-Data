# Dirty Data Cleaner

A preprocessing script to try and clean up data from an array of strings. It still has a few bugs, mainly around the numbers not being added as an element however for the exact use case of this script this is actually a feature.

Results on the real dataset containing 122,651 lines of categories and 223,112 categories within those lines
```
Raw Categories ----------------------- 124651
Lowercase everything ----------------- 124651
Split any category with multiple words 223112
Remove all categories that are numbers 223112
Remove all empty that are numbers----- 191232
Remove Dupes and convert to Obj ------ 9993
Remove all Plurals ------------------- 9146
Remove Duplicate Value for each key -- 9146
```
223k > 9.1k

------------------------------
## Steps this script takes to clean the data - output is displayed for each step

Not that whilst this list only has 14 lines we are taking each word out of every string in every element so there is actually 36 base categories here.
This means the script went from `36 to 13` not `14 to 13` categories. See below
```
Raw Categories ----------------------- 14
Lowercase everything ----------------- 14
Split any category with multiple words 36
Remove all categories that are numbers 36
Remove all empty that are numbers----- 34
Remove Dupes and convert to Obj ------ 17
Remove all Plurals ------------------- 13
Remove Duplicate Value for each key -- 13
```
```
Using this example array ---------------------- // 14 lines of categories

export const testCategories: string[] = [
    'shoes',
    'shoeS',
    'shoe fashion',
    'shoes women, high heels',
    'Shirt',
    'shirts women',
    'shIRt men',
    'shirt 12 CLOTHING',
    'dress female women/clothing/fashion',
    'dresses CLOTHING',
    'dresses summer clothing',
    'womens-dress fashion',
    '9099 men, tank-tops, 50',
    'womens-dress fashion',
];
```

```
Step 1:  Duplicate every raw category --------- // 14 lines of categories
[
  [ 'shoes', 'shoes' ],
  [ 'shoeS', 'shoeS' ],
  [ 'shoe fashion', 'shoe fashion' ],
  [ 'shoes women, high heels', 'shoes women, high heels' ],
  [ 'Shirt', 'Shirt' ],
  [ 'shirts women', 'shirts women' ],
  [ 'shIRt men', 'shIRt men' ],
  [ 'shirt 12 CLOTHING', 'shirt 12 CLOTHING' ],
  [
    'dress female women/clothing/fashion',
    'dress female women/clothing/fashion'
  ],
  [ 'dresses CLOTHING', 'dresses CLOTHING' ],
  [ 'dresses summer clothing', 'dresses summer clothing' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ],
  [ '9099 men, tank-tops, 50', '9099 men, tank-tops, 50' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ]
]
```
```
Step 2:  Raw Categories ----------------------- // 14 lines of categories
[
  [ 'shoes', 'shoes' ],
  [ 'shoeS', 'shoeS' ],
  [ 'shoe fashion', 'shoe fashion' ],
  [ 'shoes women, high heels', 'shoes women, high heels' ],
  [ 'Shirt', 'Shirt' ],
  [ 'shirts women', 'shirts women' ],
  [ 'shIRt men', 'shIRt men' ],
  [ 'shirt 12 CLOTHING', 'shirt 12 CLOTHING' ],
  [
    'dress female women/clothing/fashion',
    'dress female women/clothing/fashion'
  ],
  [ 'dresses CLOTHING', 'dresses CLOTHING' ],
  [ 'dresses summer clothing', 'dresses summer clothing' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ],
  [ '9099 men, tank-tops, 50', '9099 men, tank-tops, 50' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ]
]
```
```
Step 3:  Lowercase everything ----------------- // 14 lines of categories
[
  [ 'shoes', 'shoes' ],
  [ 'shoes', 'shoes' ],
  [ 'shoe fashion', 'shoe fashion' ],
  [ 'shoes women, high heels', 'shoes women, high heels' ],
  [ 'shirt', 'shirt' ],
  [ 'shirts women', 'shirts women' ],
  [ 'shirt men', 'shirt men' ],
  [ 'shirt 12 clothing', 'shirt 12 clothing' ],
  [
    'dress female women/clothing/fashion',
    'dress female women/clothing/fashion'
  ],
  [ 'dresses clothing', 'dresses clothing' ],
  [ 'dresses summer clothing', 'dresses summer clothing' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ],
  [ '9099 men, tank-tops, 50', '9099 men, tank-tops, 50' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ]
]
```
```
Step 4:  Split any category with multiple words // 36 base categories 
[
  [ 'shoes', 'shoes' ],
  [ 'shoes', 'shoes' ],
  [ 'shoe', 'shoe fashion' ],
  [ 'fashion', 'shoe fashion' ],
  [ 'shoes', 'shoes women, high heels' ],
  [ 'women', 'shoes women, high heels' ],
  [ 'high', 'shoes women, high heels' ],
  [ 'heels', 'shoes women, high heels' ],
  [ 'shirt', 'shirt' ],
  [ 'shirts', 'shirts women' ],
  [ 'women', 'shirts women' ],
  [ 'shirt', 'shirt men' ],
  [ 'men', 'shirt men' ],
  [ 'shirt', 'shirt 12 clothing' ],
  [ 'clothing', 'shirt 12 clothing' ],
  [ 'dress', 'dress female women/clothing/fashion' ],
  [ 'female', 'dress female women/clothing/fashion' ],
  [ 'women', 'dress female women/clothing/fashion' ],
  [ 'clothing', 'dress female women/clothing/fashion' ],
  [ 'fashion', 'dress female women/clothing/fashion' ],
  [ 'dresses', 'dresses clothing' ],
  [ 'clothing', 'dresses clothing' ],
  [ 'dresses', 'dresses summer clothing' ],
  [ 'summer', 'dresses summer clothing' ],
  [ 'clothing', 'dresses summer clothing' ],
  [ 'womens', 'womens-dress fashion' ],
  [ 'dress', 'womens-dress fashion' ],
  [ 'fashion', 'womens-dress fashion' ],
  [ '', '9099 men, tank-tops, 50' ],
  [ 'men', '9099 men, tank-tops, 50' ],
  [ 'tank', '9099 men, tank-tops, 50' ],
  [ 'tops', '9099 men, tank-tops, 50' ],
  [ '', '9099 men, tank-tops, 50' ],
  [ 'womens', 'womens-dress fashion' ],
  [ 'dress', 'womens-dress fashion' ],
  [ 'fashion', 'womens-dress fashion' ]
]
```
```
Step 5: Remove all categories that are numbers // 36 base categories

[
  [ 'shoes', 'shoes' ],
  [ 'shoes', 'shoes' ],
  [ 'shoe', 'shoe fashion' ],
  [ 'fashion', 'shoe fashion' ],
  [ 'shoes', 'shoes women, high heels' ],
  [ 'women', 'shoes women, high heels' ],
  [ 'high', 'shoes women, high heels' ],
  [ 'heels', 'shoes women, high heels' ],
  [ 'shirt', 'shirt' ],
  [ 'shirts', 'shirts women' ],
  [ 'women', 'shirts women' ],
  [ 'shirt', 'shirt men' ],
  [ 'men', 'shirt men' ],
  [ 'shirt', 'shirt 12 clothing' ],
  [ 'clothing', 'shirt 12 clothing' ],
  [ 'dress', 'dress female women/clothing/fashion' ],
  [ 'female', 'dress female women/clothing/fashion' ],
  [ 'women', 'dress female women/clothing/fashion' ],
  [ 'clothing', 'dress female women/clothing/fashion' ],
  [ 'fashion', 'dress female women/clothing/fashion' ],
  [ 'dresses', 'dresses clothing' ],
  [ 'clothing', 'dresses clothing' ],
  [ 'dresses', 'dresses summer clothing' ],
  [ 'summer', 'dresses summer clothing' ],
  [ 'clothing', 'dresses summer clothing' ],
  [ 'womens', 'womens-dress fashion' ],
  [ 'dress', 'womens-dress fashion' ],
  [ 'fashion', 'womens-dress fashion' ],
  [ '', '9099 men, tank-tops, 50' ],
  [ 'men', '9099 men, tank-tops, 50' ],
  [ 'tank', '9099 men, tank-tops, 50' ],
  [ 'tops', '9099 men, tank-tops, 50' ],
  [ '', '9099 men, tank-tops, 50' ],
  [ 'womens', 'womens-dress fashion' ],
  [ 'dress', 'womens-dress fashion' ],
  [ 'fashion', 'womens-dress fashion' ]
]
```
```
Step 6:  Remove all empty that are numbers----- // 34 base categories
[
  [ 'shoes', 'shoes' ],
  [ 'shoes', 'shoes' ],
  [ 'shoe', 'shoe fashion' ],
  [ 'fashion', 'shoe fashion' ],
  [ 'shoes', 'shoes women, high heels' ],
  [ 'women', 'shoes women, high heels' ],
  [ 'high', 'shoes women, high heels' ],
  [ 'heels', 'shoes women, high heels' ],
  [ 'shirt', 'shirt' ],
  [ 'shirts', 'shirts women' ],
  [ 'women', 'shirts women' ],
  [ 'shirt', 'shirt men' ],
  [ 'men', 'shirt men' ],
  [ 'shirt', 'shirt 12 clothing' ],
  [ 'clothing', 'shirt 12 clothing' ],
  [ 'dress', 'dress female women/clothing/fashion' ],
  [ 'female', 'dress female women/clothing/fashion' ],
  [ 'women', 'dress female women/clothing/fashion' ],
  [ 'clothing', 'dress female women/clothing/fashion' ],
  [ 'fashion', 'dress female women/clothing/fashion' ],
  [ 'dresses', 'dresses clothing' ],
  [ 'clothing', 'dresses clothing' ],
  [ 'dresses', 'dresses summer clothing' ],
  [ 'summer', 'dresses summer clothing' ],
  [ 'clothing', 'dresses summer clothing' ],
  [ 'womens', 'womens-dress fashion' ],
  [ 'dress', 'womens-dress fashion' ],
  [ 'fashion', 'womens-dress fashion' ],
  [ 'men', '9099 men, tank-tops, 50' ],
  [ 'tank', '9099 men, tank-tops, 50' ],
  [ 'tops', '9099 men, tank-tops, 50' ],
  [ 'womens', 'womens-dress fashion' ],
  [ 'dress', 'womens-dress fashion' ],
  [ 'fashion', 'womens-dress fashion' ]
]
```
```
Step 7:  Remove Dupes and convert to Obj ------ // 17 base categories
{
  shoes: [ 'shoes', 'shoes', 'shoes women, high heels' ],
  shoe: [ 'shoe fashion' ],
  fashion: [
    'shoe fashion',
    'dress female women/clothing/fashion',
    'womens-dress fashion',
    'womens-dress fashion'
  ],
  women: [
    'shoes women, high heels',
    'shirts women',
    'dress female women/clothing/fashion'
  ],
  high: [ 'shoes women, high heels' ],
  heels: [ 'shoes women, high heels' ],
  shirt: [ 'shirt', 'shirt men', 'shirt 12 clothing' ],
  shirts: [ 'shirts women' ],
  men: [ 'shirt men', '9099 men, tank-tops, 50' ],
  clothing: [
    'shirt 12 clothing',
    'dress female women/clothing/fashion',
    'dresses clothing',
    'dresses summer clothing'
  ],
  dress: [
    'dress female women/clothing/fashion',
    'womens-dress fashion',
    'womens-dress fashion'
  ],
  female: [ 'dress female women/clothing/fashion' ],
  dresses: [ 'dresses clothing', 'dresses summer clothing' ],
  summer: [ 'dresses summer clothing' ],
  womens: [ 'womens-dress fashion', 'womens-dress fashion' ],
  tank: [ '9099 men, tank-tops, 50' ],
  tops: [ '9099 men, tank-tops, 50' ]
}
```
```
Step 8:  Remove all Plurals ------------------- // 13 base categories
{
  shoe: [ 'shoe fashion', 'shoes', 'shoes', 'shoes women, high heels' ],
  fashion: [
    'shoe fashion',
    'dress female women/clothing/fashion',
    'womens-dress fashion',
    'womens-dress fashion'
  ],
  women: [
    'shoes women, high heels',
    'shirts women',
    'dress female women/clothing/fashion',
    'womens-dress fashion',
    'womens-dress fashion'
  ],
  high: [ 'shoes women, high heels' ],
  heels: [ 'shoes women, high heels' ],
  shirt: [ 'shirt', 'shirt men', 'shirt 12 clothing', 'shirts women' ],
  men: [ 'shirt men', '9099 men, tank-tops, 50' ],
  clothing: [
    'shirt 12 clothing',
    'dress female women/clothing/fashion',
    'dresses clothing',
    'dresses summer clothing'
  ],
  dress: [
    'dress female women/clothing/fashion',
    'womens-dress fashion',
    'womens-dress fashion',
    'dresses clothing',
    'dresses summer clothing'
  ],
  female: [ 'dress female women/clothing/fashion' ],
  summer: [ 'dresses summer clothing' ],
  tank: [ '9099 men, tank-tops, 50' ],
  tops: [ '9099 men, tank-tops, 50' ]
}
```
```
Step 9: Remove Duplicate Value for each key -- // 13 base categories
  {
  shoe: [ 'shoe fashion', 'shoes', 'shoes women, high heels' ],
  fashion: [
    'shoe fashion',
    'dress female women/clothing/fashion',
    'womens-dress fashion'
  ],
  women: [
    'shoes women, high heels',
    'shirts women',
    'dress female women/clothing/fashion',
    'womens-dress fashion'
  ],
  high: [ 'shoes women, high heels' ],
  heels: [ 'shoes women, high heels' ],
  shirt: [ 'shirt', 'shirt men', 'shirt 12 clothing', 'shirts women' ],
  men: [ 'shirt men', '9099 men, tank-tops, 50' ],
  clothing: [
    'shirt 12 clothing',
    'dress female women/clothing/fashion',
    'dresses clothing',
    'dresses summer clothing'
  ],
  dress: [
    'dress female women/clothing/fashion',
    'womens-dress fashion',
    'dresses clothing',
    'dresses summer clothing'
  ],
  female: [ 'dress female women/clothing/fashion' ],
  summer: [ 'dresses summer clothing' ],
  tank: [ '9099 men, tank-tops, 50' ],
  tops: [ '9099 men, tank-tops, 50' ]
}
```


