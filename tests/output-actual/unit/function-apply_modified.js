var person = {
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
	
};
var person1 = {
    firstName: "Mary",
    lastName: "Doe"
};
var name = person.fullName.apply(person1);  // Will return "Mary Doe"
console.log(name);
