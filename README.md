# Dirty Data Cleaner

A preprocessing script to try and clean up data from an array of strings.


## Steps this script takes to clean the data
### I will display the output at each step.

Using an example array 
```
export const testCategories: string[] = [
    'shoes',
    'shoeS',
    'shoe fashion',
    'shoes women, high heels',
    'Shirt',
    'shirts women',
    'shIRt men',
    'shirt CLOTHING',
    'dress female women/clothing/fashion',
    'dresses CLOTHING',
    'dresses summer clothing'
    'womens-dress fashion',
    '9099/ men, tank-tops, $50',
];
```

1. converts array from arr = [x] to arr = [x ,x] the arr[1] is the raw category data that we can use to map later
```
[
  [ 'shoes', 'shoes' ],
  [ 'shoeS', 'shoeS' ],
  [ 'shoe fashion', 'shoe fashion' ],
  [ 'shoes women, high heels', 'shoes women, high heels' ],
  [ 'Shirt', 'Shirt' ],
  [ 'shirts women', 'shirts women' ],
  [ 'shIRt men', 'shIRt men' ],
  [ 'shirt CLOTHING', 'shirt CLOTHING' ],
  [
    'dress female women/clothing/fashion',
    'dress female women/clothing/fashion'
  ],
  [ 'dresses CLOTHING', 'dresses CLOTHING' ],
  [ 'dresses summer clothing', 'dresses summer clothing' ],
  [ 'womens-dress fashion', 'womens-dress fashion' ],
  [ '9099/ men, tank-tops, $50', '9099/ men, tank-tops, $50' ]
]
```

1. convert both indexes to lowercase
2. split arr[0][0] at any non a-z char
    for all the split terms that do not exist yet in arr[0][0] push another element to arr - 
    arr.push[arr[0][0], arr[0][1]]
    

