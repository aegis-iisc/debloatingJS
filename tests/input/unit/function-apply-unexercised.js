var person = {
    fullName: function() {
        return this.firstName + " " + this.lastName;
    },
   otherName : function(){
		return this.otherName;

	}
	
};
var person1 = {
    firstName: "Mary",
    lastName: "Doe",
    otherName: "X"
};
var name = person.fullName.apply(person1);  // Will return "Mary Doe"
console.log(name);
