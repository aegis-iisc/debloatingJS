J$.iids = {"9":[2,5,2,12],"17":[2,17,2,31],"25":[2,5,2,32],"27":[2,5,2,16],"33":[2,5,2,33],"41":[1,1,3,2],"49":[1,1,3,2],"57":[1,1,3,2],"65":[1,1,3,2],"73":[1,1,3,2],"81":[1,1,3,2],"89":[1,1,3,2],"97":[1,1,3,2],"105":[1,1,3,2],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test1.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test1_jalangi_.js","code":"function foo () {\n    console.log('hello world!');\n}"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(57, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test1_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test1.js');
            function foo() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(41, arguments.callee, this, arguments);
                            arguments = J$.N(49, 'arguments', arguments, 4);
                            J$.X1(33, J$.M(25, J$.R(9, 'console', console, 2), 'log', 0)(J$.T(17, 'hello world!', 21, false)));
                        } catch (J$e) {
                            J$.Ex(81, J$e);
                        } finally {
                            if (J$.Fr(89))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            foo = J$.N(73, 'foo', J$.T(65, foo, 12, false, 41), 0);
        } catch (J$e) {
            J$.Ex(97, J$e);
        } finally {
            if (J$.Sr(105)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
