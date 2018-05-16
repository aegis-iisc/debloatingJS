// do not remove the following comment
// JALANGI DO NOT INSTRUMENT

/**
 * @author  Koushik Sen
 *
 */
(function (sandbox) {
    function MyAnalysis() {
	var s = "test function string";
	var testReplacementFunction = function (){
		console.log("this is a test function with parameter "+ s);

	}
        this.invokeFunPre = function (iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {
            if (typeof evilFunction === "function" && f === evilFunction) {
		console.log("f : "+ f + " base : "+ base+ " args : "+ args + "isC : "+ isConstructor);
                return {f: testReplacementFunction, base: base, args: [s], skip: true};
            }
        };
	    this.invokeFun = function () {

        }
    }

    sandbox.analysis = new MyAnalysis();
}(J$));

/*
 node src/js/commands/jalangi.js --inlineIID --inlineSource --analysis src/js/sample_analyses/pldi16/SkipFunction.js tests/pldi16/SkipFunctionTest.js
 */

