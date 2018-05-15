J$.iids = {"8":[14,5,14,55],"9":[3,5,3,12],"10":[14,5,14,13],"16":[14,5,14,55],"17":[3,17,3,42],"18":[14,5,14,28],"25":[3,5,3,43],"26":[14,32,14,55],"27":[3,5,3,16],"33":[3,5,3,44],"34":[15,14,15,38],"41":[2,16,4,2],"49":[2,16,4,2],"57":[2,16,4,2],"65":[2,16,4,2],"73":[2,1,4,2],"81":[8,5,8,12],"89":[8,17,8,80],"97":[8,5,8,81],"99":[8,5,8,16],"105":[8,5,8,82],"113":[7,16,11,2],"121":[7,16,11,2],"129":[7,16,11,2],"137":[7,16,11,2],"145":[7,1,11,2],"153":[14,12,14,13],"161":[14,18,14,28],"169":[14,32,14,33],"177":[14,32,14,41],"179":[14,32,14,39],"185":[14,46,14,55],"193":[15,2,15,9],"201":[15,14,15,26],"209":[15,29,15,30],"217":[15,29,15,38],"219":[15,29,15,36],"225":[15,2,15,39],"227":[15,2,15,13],"233":[15,2,15,40],"241":[13,20,18,2],"249":[13,20,18,2],"257":[13,20,18,2],"265":[13,20,18,2],"273":[13,20,18,2],"281":[13,1,18,2],"289":[19,1,19,13],"297":[19,1,19,15],"305":[19,1,19,16],"313":[21,5,21,17],"321":[21,5,21,19],"329":[21,5,21,19],"337":[21,1,21,20],"345":[22,1,22,8],"353":[22,13,22,14],"361":[22,1,22,15],"363":[22,1,22,12],"369":[22,1,22,16],"377":[23,1,23,13],"385":[23,1,23,15],"393":[23,1,23,16],"401":[1,1,24,1],"409":[2,16,4,2],"417":[2,16,4,2],"425":[7,16,11,2],"433":[7,16,11,2],"441":[14,1,16,2],"449":[13,20,18,2],"457":[13,20,18,2],"465":[1,1,24,1],"473":[1,1,24,1],"nBranches":4,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/SkipFunctionTest.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/SkipFunctionTest_jalangi_.js","code":"\ngoodFunction = function () {\n    console.log(\"Executing good function\");\n}\n\n\nevilFunction = function () {\n    console.log(\"****************** Executing bad function *******************\");\n   \n\t\n}\n\nprintReturnValue = function (f){\nif (typeof f === \"function\" && f.apply() !== undefined ){\n\tconsole.log(\"f returns \"+  f.apply());\n}\n\n}\ngoodFunction();\n//printReturnValue(evilFunction);\nt = evilFunction();\nconsole.log(t);\ngoodFunction();\n"};
jalangiLabel3:
    while (true) {
        try {
            J$.Se(401, '/home/ashish/work/NEU/jalangi2/tests/pldi16/SkipFunctionTest_jalangi_.js', '/home/ashish/work/NEU/jalangi2/tests/pldi16/SkipFunctionTest.js');
            J$.X1(73, goodFunction = J$.W(65, 'goodFunction', J$.T(57, function () {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(41, arguments.callee, this, arguments);
                            arguments = J$.N(49, 'arguments', arguments, 4);
                            J$.X1(33, J$.M(25, J$.R(9, 'console', console, 2), 'log', 0)(J$.T(17, "Executing good function", 21, false)));
                        } catch (J$e) {
                            J$.Ex(409, J$e);
                        } finally {
                            if (J$.Fr(417))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 41), J$.I(typeof goodFunction === 'undefined' ? undefined : goodFunction), 4));
            J$.X1(145, evilFunction = J$.W(137, 'evilFunction', J$.T(129, function () {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(113, arguments.callee, this, arguments);
                            arguments = J$.N(121, 'arguments', arguments, 4);
                            J$.X1(105, J$.M(97, J$.R(81, 'console', console, 2), 'log', 0)(J$.T(89, "****************** Executing bad function *******************", 21, false)));
                        } catch (J$e) {
                            J$.Ex(425, J$e);
                        } finally {
                            if (J$.Fr(433))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 113), J$.I(typeof evilFunction === 'undefined' ? undefined : evilFunction), 4));
            J$.X1(281, printReturnValue = J$.W(273, 'printReturnValue', J$.T(265, function (f) {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(241, arguments.callee, this, arguments);
                            arguments = J$.N(249, 'arguments', arguments, 4);
                            f = J$.N(257, 'f', f, 4);
                            if (J$.X1(441, J$.C(16, J$.C(8, J$.B(18, '===', J$.U(10, 'typeof', J$.R(153, 'f', f, 0)), J$.T(161, "function", 21, false), 0)) ? J$.B(26, '!==', J$.M(177, J$.R(169, 'f', f, 0), 'apply', 0)(), J$.T(185, undefined, 24, false), 0) : J$._()))) {
                                J$.X1(233, J$.M(225, J$.R(193, 'console', console, 2), 'log', 0)(J$.B(34, '+', J$.T(201, "f returns ", 21, false), J$.M(217, J$.R(209, 'f', f, 0), 'apply', 0)(), 0)));
                            }
                        } catch (J$e) {
                            J$.Ex(449, J$e);
                        } finally {
                            if (J$.Fr(457))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 241), J$.I(typeof printReturnValue === 'undefined' ? undefined : printReturnValue), 4));
            J$.X1(305, J$.F(297, J$.R(289, 'goodFunction', goodFunction, 2), 0)());
            J$.X1(337, t = J$.W(329, 't', J$.F(321, J$.R(313, 'evilFunction', evilFunction, 2), 0)(), J$.I(typeof t === 'undefined' ? undefined : t), 4));
            J$.X1(369, J$.M(361, J$.R(345, 'console', console, 2), 'log', 0)(J$.R(353, 't', t, 2)));
            J$.X1(393, J$.F(385, J$.R(377, 'goodFunction', goodFunction, 2), 0)());
        } catch (J$e) {
            J$.Ex(465, J$e);
        } finally {
            if (J$.Sr(473)) {
                J$.L();
                continue jalangiLabel3;
            } else {
                J$.L();
                break jalangiLabel3;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
