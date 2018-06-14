J$.iids = {"9":[2,5,2,12],"17":[2,17,2,31],"25":[2,5,2,32],"27":[2,5,2,16],"33":[2,5,2,33],"41":[1,1,3,2],"49":[1,1,3,2],"57":[8,2,8,9],"65":[8,14,8,40],"73":[8,2,8,41],"75":[8,2,8,13],"81":[8,2,8,42],"89":[6,1,9,2],"97":[6,1,9,2],"105":[10,1,10,4],"113":[10,1,10,6],"121":[10,1,10,7],"129":[1,1,11,1],"137":[1,1,3,2],"145":[1,1,11,1],"153":[6,1,9,2],"161":[1,1,11,1],"169":[1,1,3,2],"177":[1,1,3,2],"185":[6,1,9,2],"193":[6,1,9,2],"201":[1,1,11,1],"209":[1,1,11,1],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test4.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test4_jalangi_.js","code":"function foo () {\n    console.log('hello world!');\n}\n\n\nfunction bar(){\n\n console.log('hello I am never invoked');\n}\nfoo();\n"};
jalangiLabel2:
    while (true) {
        try {
            J$.Se(129, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test4_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test4.js');
            function foo() {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(41, arguments.callee, this, arguments);
                            arguments = J$.N(49, 'arguments', arguments, 4);
                            J$.X1(33, J$.M(25, J$.R(9, 'console', console, 2), 'log', 0)(J$.T(17, 'hello world!', 21, false)));
                        } catch (J$e) {
                            J$.Ex(169, J$e);
                        } finally {
                            if (J$.Fr(177))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            function bar() {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(89, arguments.callee, this, arguments);
                            arguments = J$.N(97, 'arguments', arguments, 4);
                            J$.X1(81, J$.M(73, J$.R(57, 'console', console, 2), 'log', 0)(J$.T(65, 'hello I am never invoked', 21, false)));
                        } catch (J$e) {
                            J$.Ex(185, J$e);
                        } finally {
                            if (J$.Fr(193))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }
            foo = J$.N(145, 'foo', J$.T(137, foo, 12, false, 41), 0);
            bar = J$.N(161, 'bar', J$.T(153, bar, 12, false, 89), 0);
            J$.X1(121, J$.F(113, J$.R(105, 'foo', foo, 1), 0)());
        } catch (J$e) {
            J$.Ex(201, J$e);
        } finally {
            if (J$.Sr(209)) {
                J$.L();
                continue jalangiLabel2;
            } else {
                J$.L();
                break jalangiLabel2;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
