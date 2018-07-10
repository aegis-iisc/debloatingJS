// A function defined in a class
class Numbers {  
  constructor(array) {
    this.array = array;
  }
  addNumber(number) {
    if (number !== undefined) {
       this.array.push(number);
    } 
  //  return (number) => { 
     // console.log(this === numbersObject); // => true
     // this.array.push(number);
   // };
  }
}
var numbersObject = new Numbers([]);  
numbersObject.addNumber(1);  
//var addMethod = numbersObject.addNumber();  
//addMethod(5);  
//console.log(numbersObject.array); 
