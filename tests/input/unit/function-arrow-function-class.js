class Numbers {  
  constructor(number) {
    this.number = number;
  }
  addNumber(m) {
    return (m) => { 
      console.log(this === numbersObject); // => true
      this.number = this.number + m;
    };
  }
}
var numbersObject = new Numbers(0);  
numbersObject.addNumber(1);  
var addMethod = numbersObject.addNumber();  
addMethod(5);  
console.log(numbersObject.number);
