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
