/* String to String Subtraction
 * Requirement:
 * 	Param 1 >= Param 2
 *  Param 1 and Param 2 is String
 *
 * return String of the result
 */

const strMinus = (strA, strB) => {
	//Copy over the strA into array for the carry over calculation since it would use 2 digit in 1 char space
  let arrA = [...strA];
  //Indexes that is needed to keep track of both string, and another index for the carry over calculation
  let aIndex = strA.length - 1, bIndex = strB.length - 1, oIndex;
  //Final value in String
  let final = "";
  //Calculation ends whenever the subtractor is finished using all its digits
  while (bIndex >= 0) {
  	//Compare the char from strA's digit to strB's digit
    if (parseInt(arrA[aIndex]) >= parseInt(strB.charAt(bIndex))) {
    	//Normal Subtraction
    	final = (arrA[aIndex--] - strB.charAt(bIndex--)).toString() + final;
    } else {
    	//Carry Digit Calculations
    	oIndex = aIndex;
    	do {
      	arrA[oIndex] = (10 + parseInt(arrA[oIndex])).toString();
      	arrA[oIndex - 1] = (parseInt(arrA[oIndex - 1]) - 1).toString();
      } while (parseInt(arrA[--oIndex]) < 0);
    }
  }
  //Add the remaining digit from arrayA back to the final
  while (aIndex >= 0) {
  	final = arrA[aIndex--] + final;
  }
  //Trim leading 0s
  final = parseInt(final).toString();

  return final;
}