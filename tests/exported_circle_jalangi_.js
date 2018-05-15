J$.iids = {"8":[29,6,29,17],"9":[2,15,2,21],"10":[9,9,9,25],"17":[2,32,2,34],"18":[9,9,9,34],"25":[2,15,2,34],"26":[19,9,19,20],"33":[2,15,2,34],"34":[19,9,19,29],"41":[2,15,2,34],"42":[24,9,24,27],"49":[5,14,5,18],"50":[29,6,29,17],"57":[5,14,5,18],"65":[5,14,5,18],"73":[6,23,6,24],"81":[6,23,6,24],"89":[6,23,6,24],"97":[7,1,7,8],"105":[9,9,9,13],"113":[9,9,9,16],"121":[9,19,9,25],"129":[9,28,9,34],"137":[9,9,9,34],"145":[9,2,9,35],"153":[7,16,11,2],"161":[7,16,11,2],"169":[7,16,11,2],"177":[7,16,11,2],"185":[7,1,11,2],"193":[7,1,11,3],"201":[14,2,14,9],"209":[14,14,14,31],"217":[14,2,14,32],"219":[14,2,14,13],"225":[14,2,14,33],"233":[12,1,16,2],"241":[12,1,16,2],"249":[17,1,17,8],"257":[19,9,19,10],"265":[19,13,19,17],"273":[19,13,19,20],"281":[19,23,19,29],"289":[19,9,19,29],"297":[19,2,19,30],"305":[17,21,20,2],"313":[17,21,20,2],"321":[17,21,20,2],"329":[17,21,20,2],"337":[17,1,20,2],"345":[17,1,20,3],"353":[22,1,22,8],"361":[23,23,23,24],"369":[23,23,23,24],"377":[23,23,23,24],"385":[24,9,24,10],"393":[24,13,24,27],"401":[24,9,24,27],"409":[24,2,24,28],"417":[22,20,25,2],"425":[22,20,25,2],"433":[22,20,25,2],"441":[22,20,25,2],"449":[22,20,25,2],"457":[22,1,25,2],"465":[22,1,25,3],"473":[27,1,27,8],"481":[29,6,29,12],"489":[29,16,29,17],"497":[30,10,30,14],"505":[30,10,30,14],"513":[30,3,30,15],"521":[32,10,32,15],"529":[32,10,32,15],"537":[32,3,32,16],"545":[27,24,34,2],"553":[27,24,34,2],"561":[27,24,34,2],"569":[27,24,34,2],"577":[27,1,34,2],"585":[27,1,34,3],"593":[1,1,35,1],"601":[1,1,35,1],"609":[1,1,35,1],"617":[1,1,35,1],"625":[12,1,16,2],"633":[1,1,35,1],"641":[7,16,11,2],"649":[7,16,11,2],"657":[12,1,16,2],"665":[12,1,16,2],"673":[17,21,20,2],"681":[17,21,20,2],"689":[22,20,25,2],"697":[22,20,25,2],"705":[29,2,32,16],"713":[27,24,34,2],"721":[27,24,34,2],"729":[1,1,35,1],"737":[1,1,35,1],"nBranches":2,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/exported_circle.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/exported_circle_jalangi_.js","code":"/* A circle class with eported functions, We wish to see how much of these code is actually loaded in the application */\nvar exports = module.exports = {};\n\n\nconst math = Math;\nvar unused_diameter = 2;\nexports.area = function (radius) {\n\n\treturn math.PI * radius * radius;\n\n};\nfunction unused_function(){\n\n\tconsole.log(\"Unused Function\");\n\n}\nexports.perimeter = function (radius)  {\n\n\treturn 2 * math.PI * radius;\n};\n\nexports.diameter = function (radius) {\n\tvar unused_dimeter = 2;\n\treturn 2 * unused_dimeter;\n};\n\nexports.isNontrivial = function (radius){\n\n\tif (radius >= 0)\n\t\treturn true;\n\telse \n\t\treturn false;\n\n};\n"};
jalangiLabel6:
    while (true) {
        try {
            J$.Se(593, '/home/ashish/work/NEU/jalangi2/tests/pldi16/exported_circle_jalangi_.js', '/home/ashish/work/NEU/jalangi2/tests/pldi16/exported_circle.js');
            function unused_function() {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(233, arguments.callee, this, arguments);
                            arguments = J$.N(241, 'arguments', arguments, 4);
                            J$.X1(225, J$.M(217, J$.R(201, 'console', console, 2), 'log', 0)(J$.T(209, "Unused Function", 21, false)));
                        } catch (J$e) {
                            J$.Ex(657, J$e);
                        } finally {
                            if (J$.Fr(665))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(601, 'exports', exports, 0);
            J$.N(609, 'math', math, 0);
            J$.N(617, 'unused_diameter', unused_diameter, 0);
            unused_function = J$.N(633, 'unused_function', J$.T(625, unused_function, 12, false, 233), 0);
            var exports = J$.X1(41, J$.W(33, 'exports', J$.P(25, J$.R(9, 'module', module, 2), 'exports', J$.T(17, {}, 11, false), 0), exports, 3));
            const math = J$.X1(65, J$.W(57, 'math', J$.R(49, 'Math', Math, 2), math, 3));
            var unused_diameter = J$.X1(89, J$.W(81, 'unused_diameter', J$.T(73, 2, 22, false), unused_diameter, 3));
            J$.X1(193, J$.P(185, J$.R(97, 'exports', exports, 1), 'area', J$.T(177, function (radius) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(153, arguments.callee, this, arguments);
                            arguments = J$.N(161, 'arguments', arguments, 4);
                            radius = J$.N(169, 'radius', radius, 4);
                            return J$.X1(145, J$.Rt(137, J$.B(18, '*', J$.B(10, '*', J$.G(113, J$.R(105, 'math', math, 1), 'PI', 0), J$.R(121, 'radius', radius, 0), 0), J$.R(129, 'radius', radius, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(641, J$e);
                        } finally {
                            if (J$.Fr(649))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 153), 0));
            J$.X1(345, J$.P(337, J$.R(249, 'exports', exports, 1), 'perimeter', J$.T(329, function (radius) {
                jalangiLabel3:
                    while (true) {
                        try {
                            J$.Fe(305, arguments.callee, this, arguments);
                            arguments = J$.N(313, 'arguments', arguments, 4);
                            radius = J$.N(321, 'radius', radius, 4);
                            return J$.X1(297, J$.Rt(289, J$.B(34, '*', J$.B(26, '*', J$.T(257, 2, 22, false), J$.G(273, J$.R(265, 'math', math, 1), 'PI', 0), 0), J$.R(281, 'radius', radius, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(673, J$e);
                        } finally {
                            if (J$.Fr(681))
                                continue jalangiLabel3;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 305), 0));
            J$.X1(465, J$.P(457, J$.R(353, 'exports', exports, 1), 'diameter', J$.T(449, function (radius) {
                jalangiLabel4:
                    while (true) {
                        try {
                            J$.Fe(417, arguments.callee, this, arguments);
                            arguments = J$.N(425, 'arguments', arguments, 4);
                            radius = J$.N(433, 'radius', radius, 4);
                            J$.N(441, 'unused_dimeter', unused_dimeter, 0);
                            var unused_dimeter = J$.X1(377, J$.W(369, 'unused_dimeter', J$.T(361, 2, 22, false), unused_dimeter, 1));
                            return J$.X1(409, J$.Rt(401, J$.B(42, '*', J$.T(385, 2, 22, false), J$.R(393, 'unused_dimeter', unused_dimeter, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(689, J$e);
                        } finally {
                            if (J$.Fr(697))
                                continue jalangiLabel4;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 417), 0));
            J$.X1(585, J$.P(577, J$.R(473, 'exports', exports, 1), 'isNontrivial', J$.T(569, function (radius) {
                jalangiLabel5:
                    while (true) {
                        try {
                            J$.Fe(545, arguments.callee, this, arguments);
                            arguments = J$.N(553, 'arguments', arguments, 4);
                            radius = J$.N(561, 'radius', radius, 4);
                            if (J$.X1(705, J$.C(8, J$.B(50, '>=', J$.R(481, 'radius', radius, 0), J$.T(489, 0, 22, false), 0))))
                                return J$.X1(513, J$.Rt(505, J$.T(497, true, 23, false)));
                            else
                                return J$.X1(537, J$.Rt(529, J$.T(521, false, 23, false)));
                        } catch (J$e) {
                            J$.Ex(713, J$e);
                        } finally {
                            if (J$.Fr(721))
                                continue jalangiLabel5;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 545), 0));
        } catch (J$e) {
            J$.Ex(729, J$e);
        } finally {
            if (J$.Sr(737)) {
                J$.L();
                continue jalangiLabel6;
            } else {
                J$.L();
                break jalangiLabel6;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
