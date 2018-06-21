var person = {
    fullName: function() {
        return this.firstName + " " + this.lastName;
    }
};
var person1 = {
    firstName:"John",
    lastName: "Doe"
};
var name = person.fullName.call(person1);  // Will return "John Doe"
console.log(name);