const line = require('./line.js');
var exports = module.exports = {};
const math = Math;
var unused_diameter = 2;
exports.area = function (radius) {
    return math.PI * radius * radius;
};
function unused_function() {
    console.log('Unused Function');
}
exports.perimeter = function (radius) {
    return 2 * math.PI * radius;
};
exports.drawCircle = function (radius) {
    if (this.isNontrivial(radius)) {
        l = line.drawLine(exports.perimeter(radius));
        line.trim();
    }
};
exports.diameter = function (radius) {
    var _var1;
        if (original_exports.diameter == null) {
        lazyLoad(exports.diameter);
        original_exports.diameter = this.eval(cachedCode[exports.diameter]);
        exports.diameter = original_exports.diameter;
    }
        original_exports.diameter.apply(this, radius);
};
exports.isNontrivial = function (radius) {
    if (radius >= 0)
        return true;
    else
        return false;
};


function lazyLoad(funName){
	var code = fs.readFileSync(srcFile);
	var ast = esprima.parse(code);
	cachedCode[srcFile] = {};
	estraverse.traverse(ast,   {
                    enter: function (node, parent){ // check for function name and replace
                        if (node.type == 'FunctionDeclaration') {
                            var functionName = node.id.name;
			    var functionBody = node.body;
				
			    (cachedCode[srcFile])[functionName] = functionBody;

                         }
                        
                        // lhs = function(){ }
                        else if(node.type == 'ExpressionStatement'){
                            //console.log('Expression');
                           // console.log(node.expression);
                            if(node.expression.type == 'AssignmentExpression'){
                                var left = node.expression.left;
                                var right = node.expression.right;
                                /*
                                If right is a FunctionExpression, get the  name of the function from the left
                                 */
                                if(startLineNumber == node.loc.start.line) {
                                    if (right.type == 'FunctionExpression') {
                                        if (left.type == 'MemberExpression') {
                                            console.log("The expression Statement");
                                      
                                            // create a fully classified path for the function name
                                            var leftVarBaseName = left.object.name;
                                            var leftVarExtName = left.property.name;
                                            var leftVarPath = leftVarBaseName + '.' + leftVarExtName;
                                            // console.log("Fully Classified Path "+leftVarPath);
                                            // found the classified name of the function
                                            var functionName = leftVarPath;
					    var functionBody  = right.body;
					    (cachedCode[srcFile])[functionName] = functionBody;	
                                           

                                        }
                                    }
                                }
                            }else{
                                estraverse.VisitorOption.skip;
                            }
                        }else{

				estraverse.VisitorOption.skip;
			}
                    }

			});
	
	
	}

