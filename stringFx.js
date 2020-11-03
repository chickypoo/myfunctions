/* String to String Addition
 * Requirement:
 *   All values in Param are String
 *
 * return String of the result
 */
const strAdd = (...str) => {
  let carryDigit = 0, sum = 0;
  let indexArr = [], maxLength = 0;
  let final = "";
  //Initiate starting index point of all values
  str.forEach(e => {
    if (e.length > maxLength)
      maxLength = e.length;
    indexArr.push(e.length - 1);
  });
  //This is incase there are more than 10 params. For every 10 param assuming largest digit (9) will add another digit to the final sum
  maxLength += Math.floor(str.length / 10);
  //Add all digit together referencing the index assigned
  do {
    sum = carryDigit;
    for (let i = 0; i < str.length; i++)
      if (indexArr[i] >= 0)
        sum += parseInt(str[i].charAt(indexArr[i]--));
    final = (sum % 10).toString() + final;
    carryDigit = Math.floor(sum / 10);
  } while (maxLength--);  
  //Trim leading 0 if any
  while (final.charAt(0) === '0')
    final = final.substring(1);
  
  return final || '0';
}
/* String to String Subtraction
 * Requirement:
 *   Param 1 >= Param 2
 *   Param 1 and Param 2 is String
 *
 * return String of the result
 */
const strMinus = (strA, strB) => {
  let arrA = [...strA];
  let aIndex = strA.length - 1, bIndex = strB.length - 1, oIndex;
  let final = "";
  //Calculation ends whenever the subtractor is finished using all its digits
  while (bIndex >= 0)
    //Compare the char from strA's digit to strB's digit
    if (parseInt(arrA[aIndex]) >= parseInt(strB.charAt(bIndex)))
      //Normal Subtraction
      final = (arrA[aIndex--] - strB.charAt(bIndex--)).toString() + final;
    else {
      //Carry Digit Calculations
      oIndex = aIndex;
      do {
        arrA[oIndex] = (10 + parseInt(arrA[oIndex])).toString();
        arrA[oIndex - 1] = (parseInt(arrA[oIndex - 1]) - 1).toString();
      } while (parseInt(arrA[--oIndex]) < 0);
    }
  //Add the remaining digit from arrayA back to the final
  while (aIndex >= 0)
    final = arrA[aIndex--] + final;
  //Trim leading 0 if any
  while (final.charAt(0) === '0')
    final = final.substring(1);

  return final || '0';
}
/* String to String multiplications (standalone. Dont need to use strAdd function)
 * Requirement:
 *   All values in Param are String (can be decimal point)
 *
 * return String of the result
 */
const strMulti = (...args) => {
  let zeroPad = 0, decimalPoint, maxLength = 0;
  //Remove any decimals and use it as a 0 pad value
  args.forEach((str, i) => {
    if ((decimalPoint = str.indexOf('.')) >= 0) {
      zeroPad += str.length - 1 - decimalPoint;
      args[i] = str.replace(/\./, '');
    }
    while (args[i].charAt([args[i].length - 1]) === '0') {
      args[i] = args[i].substring(0, args[i].length - 1);
      zeroPad--;
    }
    while (args[i].charAt(0) === '0')
      args[i] = args[i].substring(1);
    maxLength = Math.max(maxLength, args[i].length);
  });
  //Removes any trailing 0s in the array for smaller calculation
  //Sort the args by the length of the string from least to most
  let strA, strB;
  let front, back, digitUsed = new Set(), innerFront, innerBack, finalArr = [], multiSum = 0;
  let final = '', carry, num;
  do {
    args.sort((a, b) => {
      return a.length - b.length;
    });
    //Worst case the digit of result is the sum of the 2 lengths
    strA = args.shift();
    strB = args.shift();   
    //Pad the zeroes so it is even for the criss cross multiplications
    //Since strA is the first to shift, it is always less than or equal to the length of strB
    zeroPad += strB.length - strA.length;
    strA = strA + '0'.repeat(strB.length - strA.length);
    while (strA.charAt(strA.length - 1) === '0' && strB.charAt(strB.length - 1) === '0') {
      strA = strA.slice(0, -1);
      strB = strB.slice(0, -1);
      zeroPad -= 2;
    }
    //Checks for cross multiply then checks for vertical multiply
    front = back = 0;
    do {
      innerFront = front;
      innerBack = back;
      while (digitUsed.size < (back - front + 1)) {
        //Cross Multiply available if innerFront and innerBack is different
        //Vertical Multiply availble if innerFront and innerBack is same
        if (innerFront < innerBack) {
          //Cross Multiply
          multiSum += parseInt(strA.charAt(innerFront)) * parseInt(strB.charAt(innerBack)) + parseInt(strB.charAt(innerFront)) * parseInt(strA.charAt(innerBack));
          digitUsed.add(innerFront++).add(innerBack--);
        } else {
          //Vertical Multiply
          multiSum += parseInt(strA.charAt(innerFront)) * parseInt(strB.charAt(innerFront));
          digitUsed.add(innerBack++);
        }
      }
      //Clear the set for the next time use, pushing the sum calculated into container
      digitUsed.clear();
      finalArr.push(multiSum);
      multiSum = 0;
      //Moves the front and back tracker  
      if(back < strA.length - 1)
        back++
      else
        front++
    } while (front < strA.length);
    //Using the finalArr to add only the ones digit and tens digit as carry
    carry = 0;
    finalArr.splice(0).reverse().forEach(e => {
      num = parseInt(e) + carry;
      final = (num % 10).toString() + final;
      carry = Math.floor(num / 10);
    });
    if (carry)
      final = carry.toString() + final;
    args.push(final);
    final = '';
  } while (args.length > 1);
  //Trim the leading 0s
  args = args.shift();
  while (args.charAt(0) === '0')
    args = args.substring(1);
  //Insert the decimal back using zeroPad
  if (zeroPad < 0)
    args = args + '0'.repeat(0 - zeroPad);
  else if (zeroPad > 0) {
    if (zeroPad < args.length) {
      args = `${args.substring(0, args.length - zeroPad)}.${args.substring(args.length - zeroPad)}`;
      if (args.indexOf('.') >= 0)
        while (args.charAt(args.length - 1) === '0')
          args = args.slice(0, -1);
          
      if (args.charAt(args.length - 1) === '.') 
        args = args.slice(0, -1);
    } else 
      args = `0.${'0'.repeat(zeroPad - args.length)}${args}`;
  }
  return args || "0";
}