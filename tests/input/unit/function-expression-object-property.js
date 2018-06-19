function foo(){
	var obj = {
		value : 0,
		addM (m) {

			this.value = this.value + m;

		}
		

	};

	obj.addM (2);
	console.log(obj.value);
}
foo();
