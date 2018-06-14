J$.iids = {"9":[2,5,2,12],"17":[2,17,2,31],"25":[2,5,2,32],"27":[2,5,2,16],"33":[2,5,2,33],"41":[1,1,3,2],"49":[1,1,3,2],"57":[4,1,4,4],"65":[4,1,4,6],"73":[4,1,4,7],"81":[1,1,4,7],"89":[1,1,3,2],"97":[1,1,4,7],"105":[1,1,3,2],"113":[1,1,3,2],"121":[1,1,4,7],"129":[1,1,4,7],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2_jalangi_.js","code":"function foo () {\n    console.log('hello world!');\n}\nfoo();"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(81, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2.js');
            function foo() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(41, arguments.callee, this, arguments);
                            arguments = J$.N(49, 'arguments', arguments, 4);
                            J$.X1(33, J$.M(25, J$.R(9, 'console', console, 2), 'log', 0)(J$.T(17, 'hello world!', 21, false)));
                        } catch (J$e) {
                            J$.Ex(105, J$e);
                        } finally {
                            if (J$.Fr(113))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            foo = J$.N(97, 'foo', J$.T(89, foo, 12, false, 41), 0);
            J$.X1(73, J$.F(65, J$.R(57, 'foo', foo, 1), 0)());
        } catch (J$e) {
            J$.Ex(121, J$e);
        } finally {
            if (J$.Sr(129)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
