/* String to String Addition
 * Requirement:
 *   strTrimLead String function
 *
 * @param... , this is a rest parameter accepting any numeric String values to sum together (Whole numbers only)
 * @return   , this is the sum of the params in numeric String
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
  final = strTrimLead(final);
  return final;
}
/* String to String Subtraction
 * Requirement:
 *   strTrimLead String Function
 * 
 * @param 1, numeric String that is going to be subtracted
 * @param 2, numeric String that is subtracting the param 1
 * @return , this is the numeric String value of the result
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
  final = strTrimLead(final);
  return final || '0';
}
/* String to String multiplications (standalone. Using Verdic Math method)
 * Requirement:
 *   strTrimLead  String function
 *   strTrimTrail String function
 * 
 * @param... , this is a rest parameter that multiply all numeric String value together
 * @return   , this is the numeric String value of the result
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
    args[i] = strTrimLead(args[i]);
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
  args = strTrimLead(args);
  //Insert the decimal back using zeroPad
  if (zeroPad < 0)
    args = args + '0'.repeat(0 - zeroPad);
  else if (zeroPad > 0)
    if (zeroPad < args.length) {
      args = `${args.substring(0, args.length - zeroPad)}.${args.substring(args.length - zeroPad)}`;
      if (args.indexOf('.') >= 0)
        args = strTrimTrail(args);
          
      if (args.charAt(args.length - 1) === '.') 
        args = args.slice(0, -1);
    } else 
      args = `0.${'0'.repeat(zeroPad - args.length)}${args}`;
  return args || "0";
}
/* String to String numeric comparison
 * Requirement:
 *   strTrimLead String Function
 *
 * @param 1, this is one of the numeric String to compare
 * @param 2, this is onw of the numeric String to compare
 * @return , number result : 1 if it is greater than, 0 if equal and -1 if less than
 */
const strGreaterThan = (strA, strB) => {
  //Trim leading 0 for each
  strA = strTrimLead(strA);
  strB = strTrimLead(strB);
  if (strA.length > strB.length)
    //strA is atleast a digit longer than strB
    return 1;
  else if (strA.length < strB.length)
    //strB is atleast a digit longer than strA
    return -1;
  else {
    //strA and strB are the same length. iterate each of them to compare by character
    for (let i = 0; i < strA.length; i++)
      if (strA.charAt(i) > strB.charAt(i))
        return 1;
      else if (strA.charAt(i) < strB.charAt(i))
        return -1;
    //All digit compare equally, return equal
    return 0;
  }
}
/* String leading trimmer
 * Requirement:
 *
 * @param 1, this is the numeric String to trim
 * @param 2, this is the character to look for to delete from the start, default '0'
 * @return , the trimmed version of the input String
 */
const strTrimLead = (str, char = '0') => {
  while (str.charAt(0) === char)
    str = str.slice(1);
  return str || '0';
}
/* String trailing trimmer
 * Requirement:
 *
 * @param 1, this is the numeric String to trim
 * @param 2, this is the character to look for to delete from the end, default '0'
 * @return , the trimmed version of the input String
 */
const strTrimTrail = (str, char = '0') => {
  while (str.charAt(str.length - 1) === char)
    str = str.slice(0, -1);
  return str || '0';
}
/* String normalizer
 * Requirement:
 *
 * @param 1, this is the numeric String input and fixes decimal number if it is starting with .
 * @return , normalized value
 */
const strNormalize = (str) => {
  return str.charAt(0) === '.' ? `0${str}` : str
}
/* String to String Divisor
 * Requirement:
 *   strGreaterThan String Function
 *   strAdd         String Function
 *   strMinus       String Function
 *   strTrimLead    String Function
 *   strNormalize   String Function
 *
 * @param 1, this is the divident (numeric String input)
 * @param 2, this is the divisor  (numeric String input)
 * @param 3, this is the limit of decimal places to allow, default 5 (number input)
 * @return , this is the quotient
 */
const strDivide = (strTop, strBot, decimals = 5) => {
  let zeroPad = 0, decimalPoint, strToDivide, q, final = '', oDecimal, qAfter, qInt, whole = 0, decimalPlaceFlag = false;
  //Bring both String to whole number by moving the decimal points
  if (strTop === '0')
    return strTop;
  if ((decimalPoint = strBot.indexOf('.')) >= 0) {
  	zeroPad += strBot.length - 1 - decimalPoint;
    strBot = strBot.replace(/\./, '');
  }
  if ((decimalPoint = strTop.indexOf('.')) >= 0) {
    zeroPad -= strTop.length - 1 - decimalPoint;
    strTop = strTop.replace(/\./, '');
  }
  while (zeroPad < 0) {
    strBot = strBot + '0';
    zeroPad++;
  }
  while (zeroPad > 0) {
    strTop = strTop + '0';
    zeroPad--;
  }
  while (strBot.charAt(0) === '0')
    strBot = strBot.substring(1);
  while (strTop.charAt(0) === '0')
    strTop = strTop.substring(1);
  oDecimal = decimals;
  //Grab digits from strTop up to strBot's length
  if (strTop.length > strBot.length)
    strToDivide = strTop.slice(0, -(strTop.length - strBot.length));
  else
    strToDivide = strTop;
  strTop = strTop.slice(strBot.length);
  //Dividing starts
  while (decimals >= 0 && final.length <= whole + oDecimal) {
    //Resets the single digit quotient
    q = '0';
    qInt = 0;
    while (strGreaterThan(qAfter = strAdd(q, strBot), strToDivide) <= 0) {
      q = qAfter;
      qInt++;
    }
    if (qInt && !decimalPlaceFlag && final.length == 0)
      whole++;
    //Minus the q from strToDivide
    final += qInt.toString();
    strToDivide = strMinus(strToDivide, q);
    //Add the next from strTop to the leftover strToDivide
    if (strToDivide === '0' && !strTop)
      break;
    if (strTop) {
      strToDivide += strTop.slice(0);
      strTop = strTop.substring(1);
      whole++;
    } else {
      strToDivide += '0';
      decimals--;
      decimalPlaceFlag = true;
    }
  }
  //Place the decimal in
  if (decimals === -1)
    final = `${strTrimLead(final.substring(0, final.length - oDecimal))}.${final.substring(final.length - oDecimal)}`;
  else if (decimals === oDecimal)
    final = strTrimLead(final).substring(0, whole);
  else {
    final = strTrimLead(final);
    final = `${final.substring(0, whole)}.${final.substring(whole)}`;
  }
  return strNormalize(final);
}