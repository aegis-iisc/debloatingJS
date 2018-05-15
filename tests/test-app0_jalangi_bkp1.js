J$.iids = {"9":[3,12,3,22],"17":[3,12,3,22],"25":[3,12,3,22],"33":[6,2,6,9],"41":[6,14,6,57],"49":[6,2,6,58],"51":[6,2,6,13],"57":[6,2,6,59],"65":[7,2,7,15],"73":[7,16,7,19],"81":[7,2,7,20],"89":[7,2,7,21],"97":[4,7,8,2],"105":[4,7,8,2],"113":[4,7,8,2],"121":[4,7,8,2],"129":[4,7,8,2],"137":[4,1,8,2],"145":[13,2,13,9],"153":[13,14,13,55],"161":[13,2,13,56],"163":[13,2,13,13],"169":[13,2,13,57],"177":[10,7,14,2],"185":[10,7,14,2],"193":[10,7,14,2],"201":[10,7,14,2],"209":[10,7,14,2],"217":[10,1,14,2],"225":[18,2,18,9],"233":[18,14,18,57],"241":[18,2,18,58],"243":[18,2,18,13],"249":[18,2,18,59],"257":[16,17,21,2],"265":[16,17,21,2],"273":[16,17,21,2],"281":[16,17,21,2],"289":[16,17,21,2],"297":[16,1,21,2],"305":[23,1,23,4],"313":[23,5,23,9],"321":[23,1,23,10],"329":[23,1,23,11],"337":[24,1,24,4],"345":[24,5,24,9],"353":[24,1,24,10],"361":[24,1,24,11],"369":[1,1,26,1],"377":[1,1,26,1],"385":[4,7,8,2],"393":[4,7,8,2],"401":[10,7,14,2],"409":[10,7,14,2],"417":[16,17,21,2],"425":[16,17,21,2],"433":[1,1,26,1],"441":[1,1,26,1],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/test-app0.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/test-app0_jalangi_.js","code":"\n\nvar args = \"argument\";\nfoo = function(arg){\n\n\tconsole.log(\"************* foo function **************\");\n\textrafunction(arg);\n}\n\nbar = function(arg){\n\n\n\tconsole.log(\"*********** bar function **************\");\n}\n\nextrafunction = function(arg){\n \t\n\tconsole.log(\"********** skip extra chars *************\");\n\n\n}\n\t\nfoo(args);\nbar(args);\n\n"};
jalangiLabel3:
    while (true) {
        try {
            J$.Se(369, '/home/ashish/work/NEU/jalangi2/tests/pldi16/test-app0_jalangi_.js', '/home/ashish/work/NEU/jalangi2/tests/pldi16/test-app0.js');
            J$.N(377, 'args', args, 0);
            var args = J$.X1(25, J$.W(17, 'args', J$.T(9, "argument", 21, false), args, 3));
            J$.X1(137, foo = J$.W(129, 'foo', J$.T(121, function (arg) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(97, arguments.callee, this, arguments);
                            arguments = J$.N(105, 'arguments', arguments, 4);
                            arg = J$.N(113, 'arg', arg, 4);
                            J$.X1(57, J$.M(49, J$.R(33, 'console', console, 2), 'log', 0)(J$.T(41, "************* foo function **************", 21, false)));
                            J$.X1(89, J$.F(81, J$.R(65, 'extrafunction', extrafunction, 2), 0)(J$.R(73, 'arg', arg, 0)));
                        } catch (J$e) {
                            J$.Ex(385, J$e);
                        } finally {
                            if (J$.Fr(393))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 97), J$.I(typeof foo === 'undefined' ? undefined : foo), 4));
            J$.X1(217, bar = J$.W(209, 'bar', J$.T(201, function (arg) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(177, arguments.callee, this, arguments);
                            arguments = J$.N(185, 'arguments', arguments, 4);
                            arg = J$.N(193, 'arg', arg, 4);
                            J$.X1(169, J$.M(161, J$.R(145, 'console', console, 2), 'log', 0)(J$.T(153, "*********** bar function **************", 21, false)));
                        } catch (J$e) {
                            J$.Ex(401, J$e);
                        } finally {
                            if (J$.Fr(409))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 177), J$.I(typeof bar === 'undefined' ? undefined : bar), 4));
            J$.X1(297, extrafunction = J$.W(289, 'extrafunction', J$.T(281, function (arg) {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(257, arguments.callee, this, arguments);
                            arguments = J$.N(265, 'arguments', arguments, 4);
                            arg = J$.N(273, 'arg', arg, 4);
                            J$.X1(249, J$.M(241, J$.R(225, 'console', console, 2), 'log', 0)(J$.T(233, "********** skip extra chars *************", 21, false)));
                        } catch (J$e) {
                            J$.Ex(417, J$e);
                        } finally {
                            if (J$.Fr(425))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 257), J$.I(typeof extrafunction === 'undefined' ? undefined : extrafunction), 4));
            J$.X1(329, J$.F(321, J$.R(305, 'foo', foo, 2), 0)(J$.R(313, 'args', args, 1)));
            J$.X1(361, J$.F(353, J$.R(337, 'bar', bar, 2), 0)(J$.R(345, 'args', args, 1)));
        } catch (J$e) {
            J$.Ex(433, J$e);
        } finally {
            if (J$.Sr(441)) {
                J$.L();
                continue jalangiLabel3;
            } else {
                J$.L();
                break jalangiLabel3;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
