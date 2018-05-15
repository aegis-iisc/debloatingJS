J$.iids = {"9":[2,9,2,10],"10":[12,20,12,25],"17":[2,9,2,10],"18":[12,20,12,33],"25":[2,9,2,10],"26":[12,20,12,41],"33":[3,5,3,6],"41":[3,5,3,6],"49":[3,1,3,7],"57":[8,13,8,14],"65":[8,13,8,14],"73":[8,5,8,15],"81":[12,20,12,21],"89":[12,24,12,25],"97":[12,28,12,33],"105":[12,36,12,41],"113":[12,20,12,41],"121":[12,13,12,42],"129":[11,16,13,10],"137":[11,16,13,10],"145":[11,16,13,10],"153":[11,16,13,10],"161":[11,16,13,10],"169":[11,9,13,10],"177":[10,5,14,6],"185":[10,5,14,6],"193":[10,5,14,6],"201":[16,17,16,18],"209":[16,17,16,18],"217":[16,17,16,18],"225":[18,12,18,15],"233":[18,12,18,15],"241":[18,5,18,16],"249":[5,1,19,2],"257":[5,1,19,2],"265":[5,1,19,2],"273":[10,5,14,6],"281":[5,1,19,2],"289":[5,1,19,2],"297":[21,11,21,20],"305":[21,11,21,22],"313":[21,11,21,22],"321":[21,11,21,22],"329":[22,12,22,15],"337":[22,16,22,17],"345":[22,12,22,18],"353":[22,12,22,18],"361":[22,12,22,18],"369":[23,12,23,15],"377":[23,16,23,17],"385":[23,12,23,18],"393":[23,12,23,18],"401":[23,12,23,18],"409":[25,14,25,17],"417":[25,14,25,17],"425":[25,9,25,18],"433":[25,9,25,18],"441":[26,1,26,8],"449":[26,13,26,17],"457":[26,18,26,20],"465":[26,13,26,21],"473":[26,1,26,22],"475":[26,1,26,12],"481":[26,1,26,23],"489":[27,1,27,8],"497":[27,13,27,17],"505":[27,18,27,20],"513":[27,13,27,21],"521":[27,1,27,22],"523":[27,1,27,12],"529":[27,1,27,23],"537":[1,1,28,1],"545":[1,1,28,1],"553":[5,1,19,2],"561":[1,1,28,1],"569":[1,1,28,1],"577":[1,1,28,1],"585":[1,1,28,1],"593":[1,1,28,1],"601":[11,16,13,10],"609":[11,16,13,10],"617":[10,5,14,6],"625":[10,5,14,6],"633":[5,1,19,2],"641":[5,1,19,2],"649":[1,1,28,1],"657":[1,1,28,1],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/TraceAllTest.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/TraceAllTest_jalangi_.js","code":"\nvar u = 5;\nv = 6;\n\nfunction createAdd() {\n    var CONST;\n\n    CONST = 2;\n\n    function add(x) {\n        return function(y) {\n            return x + y + CONST + ALPHA;\n        }\n    }\n\n    var ALPHA = 3;\n\n    return add;\n}\n\nvar add = createAdd();\nvar addu = add(u);\nvar addv = add(v);\n\nvar f = eval(add);\nconsole.log(addu(10));\nconsole.log(addv(10));\n"};
jalangiLabel3:
    while (true) {
        try {
            J$.Se(537, '/home/ashish/work/NEU/jalangi2/tests/pldi16/TraceAllTest_jalangi_.js', '/home/ashish/work/NEU/jalangi2/tests/pldi16/TraceAllTest.js');
            function createAdd() {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(249, arguments.callee, this, arguments);
                            function add(x) {
                                jalangiLabel1:
                                    while (true) {
                                        try {
                                            J$.Fe(177, arguments.callee, this, arguments);
                                            arguments = J$.N(185, 'arguments', arguments, 4);
                                            x = J$.N(193, 'x', x, 4);
                                            return J$.X1(169, J$.Rt(161, J$.T(153, function (y) {
                                                jalangiLabel0:
                                                    while (true) {
                                                        try {
                                                            J$.Fe(129, arguments.callee, this, arguments);
                                                            arguments = J$.N(137, 'arguments', arguments, 4);
                                                            y = J$.N(145, 'y', y, 4);
                                                            return J$.X1(121, J$.Rt(113, J$.B(26, '+', J$.B(18, '+', J$.B(10, '+', J$.R(81, 'x', x, 0), J$.R(89, 'y', y, 0), 0), J$.R(97, 'CONST', CONST, 0), 0), J$.R(105, 'ALPHA', ALPHA, 0), 0)));
                                                        } catch (J$e) {
                                                            J$.Ex(601, J$e);
                                                        } finally {
                                                            if (J$.Fr(609))
                                                                continue jalangiLabel0;
                                                            else
                                                                return J$.Ra();
                                                        }
                                                    }
                                            }, 12, false, 129)));
                                        } catch (J$e) {
                                            J$.Ex(617, J$e);
                                        } finally {
                                            if (J$.Fr(625))
                                                continue jalangiLabel1;
                                            else
                                                return J$.Ra();
                                        }
                                    }
                            }
                            arguments = J$.N(257, 'arguments', arguments, 4);
                            J$.N(265, 'CONST', CONST, 0);
                            add = J$.N(281, 'add', J$.T(273, add, 12, false, 177), 0);
                            J$.N(289, 'ALPHA', ALPHA, 0);
                            var CONST;
                            J$.X1(73, CONST = J$.W(65, 'CONST', J$.T(57, 2, 22, false), CONST, 0));
                            var ALPHA = J$.X1(217, J$.W(209, 'ALPHA', J$.T(201, 3, 22, false), ALPHA, 1));
                            return J$.X1(241, J$.Rt(233, J$.R(225, 'add', add, 0)));
                        } catch (J$e) {
                            J$.Ex(633, J$e);
                        } finally {
                            if (J$.Fr(641))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(545, 'u', u, 0);
            createAdd = J$.N(561, 'createAdd', J$.T(553, createAdd, 12, false, 249), 0);
            J$.N(569, 'add', add, 0);
            J$.N(577, 'addu', addu, 0);
            J$.N(585, 'addv', addv, 0);
            J$.N(593, 'f', f, 0);
            var u = J$.X1(25, J$.W(17, 'u', J$.T(9, 5, 22, false), u, 3));
            J$.X1(49, v = J$.W(41, 'v', J$.T(33, 6, 22, false), J$.I(typeof v === 'undefined' ? undefined : v), 4));
            var add = J$.X1(321, J$.W(313, 'add', J$.F(305, J$.R(297, 'createAdd', createAdd, 1), 0)(), add, 3));
            var addu = J$.X1(361, J$.W(353, 'addu', J$.F(345, J$.R(329, 'add', add, 1), 0)(J$.R(337, 'u', u, 1)), addu, 3));
            var addv = J$.X1(401, J$.W(393, 'addv', J$.F(385, J$.R(369, 'add', add, 1), 0)(J$.R(377, 'v', v, 2)), addv, 3));
            var f = J$.X1(433, J$.W(425, 'f', eval(J$.instrumentEvalCode(J$.R(409, 'add', add, 1), 417, true)), f, 3));
            J$.X1(481, J$.M(473, J$.R(441, 'console', console, 2), 'log', 0)(J$.F(465, J$.R(449, 'addu', addu, 1), 0)(J$.T(457, 10, 22, false))));
            J$.X1(529, J$.M(521, J$.R(489, 'console', console, 2), 'log', 0)(J$.F(513, J$.R(497, 'addv', addv, 1), 0)(J$.T(505, 10, 22, false))));
        } catch (J$e) {
            J$.Ex(649, J$e);
        } finally {
            if (J$.Sr(657)) {
                J$.L();
                continue jalangiLabel3;
            } else {
                J$.L();
                break jalangiLabel3;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
