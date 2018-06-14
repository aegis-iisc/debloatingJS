# debloatingJS
The JavaScript de-bloating project implementation

# About
CheckModuleLoading.js is the jalangi2 analysis which takes an input module and finds the loaded but invoked functions in the module or its depenncies. It generates three json objects invokeFunctions.json, loadedFunctions.json and stubList.json.

# Running the jalangi analysis for a test module "test-loading-semantics.js"
$ cd project_root
$ node $JALANGI_HOME/src/js/commands/jalangi.js --inlineIID --inlineSource --analysis analysis/CheckModuleLoading.js tests/test-loading-semantics.js.

# About
The S2STranformer.js is the source to source transformer which takes as input 3 parameters, 
1) the path to the input stubList.json created by the jalangi based analysis, 
2) path-to-the-directory where the files to be transofrmed are present 
3)path-to-output-directory to write transformed files.

The transoformer, creates a set of transformed files in (3) with each potential function in the stubList.json repalced by a stub. 
# Running
$ node S2STransformer.js -sl (1) -in (2) -o (3)






