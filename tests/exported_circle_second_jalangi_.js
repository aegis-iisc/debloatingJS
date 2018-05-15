J$.iids = {"8":[26,6,26,31],"9":[3,14,3,21],"10":[12,9,12,25],"16":[41,6,41,17],"17":[3,22,3,33],"18":[12,9,12,34],"25":[3,14,3,34],"26":[22,9,22,20],"33":[3,14,3,34],"34":[22,9,22,29],"41":[3,14,3,34],"42":[35,9,35,27],"49":[5,15,5,21],"50":[41,6,41,17],"57":[5,32,5,34],"65":[5,15,5,34],"73":[5,15,5,34],"81":[5,15,5,34],"89":[8,14,8,18],"97":[8,14,8,18],"105":[8,14,8,18],"113":[9,23,9,24],"121":[9,23,9,24],"129":[9,23,9,24],"137":[10,1,10,8],"145":[12,9,12,13],"153":[12,9,12,16],"161":[12,19,12,25],"169":[12,28,12,34],"177":[12,9,12,34],"185":[12,2,12,35],"193":[10,16,14,2],"201":[10,16,14,2],"209":[10,16,14,2],"217":[10,16,14,2],"225":[10,1,14,2],"233":[10,1,14,3],"241":[17,2,17,9],"249":[17,14,17,31],"257":[17,2,17,32],"259":[17,2,17,13],"265":[17,2,17,33],"273":[15,1,19,2],"281":[15,1,19,2],"289":[20,1,20,8],"297":[22,9,22,10],"305":[22,13,22,17],"313":[22,13,22,20],"321":[22,23,22,29],"329":[22,9,22,29],"337":[22,2,22,30],"345":[20,21,23,2],"353":[20,21,23,2],"361":[20,21,23,2],"369":[20,21,23,2],"377":[20,1,23,2],"385":[20,1,23,3],"393":[25,1,25,8],"401":[26,6,26,10],"409":[26,24,26,30],"417":[26,6,26,31],"419":[26,6,26,23],"425":[27,7,27,11],"433":[27,21,27,28],"441":[27,39,27,45],"449":[27,21,27,46],"451":[27,21,27,38],"457":[27,7,27,47],"459":[27,7,27,20],"465":[27,7,27,47],"473":[27,3,27,48],"481":[28,3,28,7],"489":[28,3,28,14],"491":[28,3,28,12],"497":[28,3,28,15],"505":[25,22,31,2],"513":[25,22,31,2],"521":[25,22,31,2],"529":[25,22,31,2],"537":[25,1,31,2],"545":[25,1,31,3],"553":[33,1,33,8],"561":[34,23,34,24],"569":[34,23,34,24],"577":[34,23,34,24],"585":[35,9,35,10],"593":[35,13,35,27],"601":[35,9,35,27],"609":[35,2,35,28],"617":[33,20,37,2],"625":[33,20,37,2],"633":[33,20,37,2],"641":[33,20,37,2],"649":[33,20,37,2],"657":[33,1,37,2],"665":[33,1,37,3],"673":[39,1,39,8],"681":[41,6,41,12],"689":[41,16,41,17],"697":[42,10,42,14],"705":[42,10,42,14],"713":[42,3,42,15],"721":[44,10,44,15],"729":[44,10,44,15],"737":[44,3,44,16],"745":[39,24,46,2],"753":[39,24,46,2],"761":[39,24,46,2],"769":[39,24,46,2],"777":[39,1,46,2],"785":[39,1,46,3],"793":[1,1,47,1],"801":[1,1,47,1],"809":[1,1,47,1],"817":[1,1,47,1],"825":[1,1,47,1],"833":[15,1,19,2],"841":[1,1,47,1],"849":[10,16,14,2],"857":[10,16,14,2],"865":[15,1,19,2],"873":[15,1,19,2],"881":[20,21,23,2],"889":[20,21,23,2],"897":[26,2,29,3],"905":[25,22,31,2],"913":[25,22,31,2],"921":[33,20,37,2],"929":[33,20,37,2],"937":[41,2,44,16],"945":[39,24,46,2],"953":[39,24,46,2],"961":[1,1,47,1],"969":[1,1,47,1],"nBranches":4,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/exported_circle_second.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/exported_circle_second_jalangi_.js","code":"/* A circle class with eported functions, We wish to see how much of these code is actually loaded in the application */\n\nconst line = require(\"./line.js\");\n\nvar exports = module.exports = {};\n\n\nconst math = Math;\nvar unused_diameter = 2;\nexports.area = function (radius) {\n\n\treturn math.PI * radius * radius;\n\n};\nfunction unused_function(){\n\n\tconsole.log(\"Unused Function\");\n\n}\nexports.perimeter = function (radius)  {\n\n\treturn 2 * math.PI * radius;\n};\n\nexports.drawCircle = function (radius){\n\tif (this.isNontrivial(radius)){\n\t\tl = line.drawLine(exports.perimeter(radius));\n\t\tline.trim();\n\t}\n\n};\n\nexports.diameter = function (radius) {\n\tvar unused_dimeter = 2;\n\treturn 2 * unused_dimeter;\n\t\n};\n\nexports.isNontrivial = function (radius){\n\n\tif (radius >= 0)\n\t\treturn true;\n\telse \n\t\treturn false;\n\n};\n"};
jalangiLabel8:
    while (true) {
        try {
            J$.Se(793, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/exported_circle_second_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/exported_circle_second.js');
            function unused_function() {
                jalangiLabel3:
                    while (true) {
                        try {
                            J$.Fe(273, arguments.callee, this, arguments);
                            arguments = J$.N(281, 'arguments', arguments, 4);
                            J$.X1(265, J$.M(257, J$.R(241, 'console', console, 2), 'log', 0)(J$.T(249, "Unused Function", 21, false)));
                        } catch (J$e) {
                            J$.Ex(865, J$e);
                        } finally {
                            if (J$.Fr(873))
                                continue jalangiLabel3;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(801, 'line', line, 0);
            J$.N(809, 'exports', exports, 0);
            J$.N(817, 'math', math, 0);
            J$.N(825, 'unused_diameter', unused_diameter, 0);
            unused_function = J$.N(841, 'unused_function', J$.T(833, unused_function, 12, false, 273), 0);
            const line = J$.X1(41, J$.W(33, 'line', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, "./line.js", 21, false)), line, 3));
            var exports = J$.X1(81, J$.W(73, 'exports', J$.P(65, J$.R(49, 'module', module, 2), 'exports', J$.T(57, {}, 11, false), 0), exports, 3));
            const math = J$.X1(105, J$.W(97, 'math', J$.R(89, 'Math', Math, 2), math, 3));
            var unused_diameter = J$.X1(129, J$.W(121, 'unused_diameter', J$.T(113, 2, 22, false), unused_diameter, 3));
            J$.X1(233, J$.P(225, J$.R(137, 'exports', exports, 1), 'area', J$.T(217, function (radius) {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(193, arguments.callee, this, arguments);
                            arguments = J$.N(201, 'arguments', arguments, 4);
                            radius = J$.N(209, 'radius', radius, 4);
                            return J$.X1(185, J$.Rt(177, J$.B(18, '*', J$.B(10, '*', J$.G(153, J$.R(145, 'math', math, 1), 'PI', 0), J$.R(161, 'radius', radius, 0), 0), J$.R(169, 'radius', radius, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(849, J$e);
                        } finally {
                            if (J$.Fr(857))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 193), 0));
            J$.X1(385, J$.P(377, J$.R(289, 'exports', exports, 1), 'perimeter', J$.T(369, function (radius) {
                jalangiLabel4:
                    while (true) {
                        try {
                            J$.Fe(345, arguments.callee, this, arguments);
                            arguments = J$.N(353, 'arguments', arguments, 4);
                            radius = J$.N(361, 'radius', radius, 4);
                            return J$.X1(337, J$.Rt(329, J$.B(34, '*', J$.B(26, '*', J$.T(297, 2, 22, false), J$.G(313, J$.R(305, 'math', math, 1), 'PI', 0), 0), J$.R(321, 'radius', radius, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(881, J$e);
                        } finally {
                            if (J$.Fr(889))
                                continue jalangiLabel4;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 345), 0));
            J$.X1(545, J$.P(537, J$.R(393, 'exports', exports, 1), 'drawCircle', J$.T(529, function (radius) {
                jalangiLabel5:
                    while (true) {
                        try {
                            J$.Fe(505, arguments.callee, this, arguments);
                            arguments = J$.N(513, 'arguments', arguments, 4);
                            radius = J$.N(521, 'radius', radius, 4);
                            if (J$.X1(897, J$.C(8, J$.M(417, J$.R(401, 'this', this, 0), 'isNontrivial', 0)(J$.R(409, 'radius', radius, 0))))) {
                                J$.X1(473, l = J$.W(465, 'l', J$.M(457, J$.R(425, 'line', line, 1), 'drawLine', 0)(J$.M(449, J$.R(433, 'exports', exports, 1), 'perimeter', 0)(J$.R(441, 'radius', radius, 0))), J$.I(typeof l === 'undefined' ? undefined : l), 4));
                                J$.X1(497, J$.M(489, J$.R(481, 'line', line, 1), 'trim', 0)());
                            }
                        } catch (J$e) {
                            J$.Ex(905, J$e);
                        } finally {
                            if (J$.Fr(913))
                                continue jalangiLabel5;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 505), 0));
            J$.X1(665, J$.P(657, J$.R(553, 'exports', exports, 1), 'diameter', J$.T(649, function (radius) {
                jalangiLabel6:
                    while (true) {
                        try {
                            J$.Fe(617, arguments.callee, this, arguments);
                            arguments = J$.N(625, 'arguments', arguments, 4);
                            radius = J$.N(633, 'radius', radius, 4);
                            J$.N(641, 'unused_dimeter', unused_dimeter, 0);
                            var unused_dimeter = J$.X1(577, J$.W(569, 'unused_dimeter', J$.T(561, 2, 22, false), unused_dimeter, 1));
                            return J$.X1(609, J$.Rt(601, J$.B(42, '*', J$.T(585, 2, 22, false), J$.R(593, 'unused_dimeter', unused_dimeter, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(921, J$e);
                        } finally {
                            if (J$.Fr(929))
                                continue jalangiLabel6;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 617), 0));
            J$.X1(785, J$.P(777, J$.R(673, 'exports', exports, 1), 'isNontrivial', J$.T(769, function (radius) {
                jalangiLabel7:
                    while (true) {
                        try {
                            J$.Fe(745, arguments.callee, this, arguments);
                            arguments = J$.N(753, 'arguments', arguments, 4);
                            radius = J$.N(761, 'radius', radius, 4);
                            if (J$.X1(937, J$.C(16, J$.B(50, '>=', J$.R(681, 'radius', radius, 0), J$.T(689, 0, 22, false), 0))))
                                return J$.X1(713, J$.Rt(705, J$.T(697, true, 23, false)));
                            else
                                return J$.X1(737, J$.Rt(729, J$.T(721, false, 23, false)));
                        } catch (J$e) {
                            J$.Ex(945, J$e);
                        } finally {
                            if (J$.Fr(953))
                                continue jalangiLabel7;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 745), 0));
        } catch (J$e) {
            J$.Ex(961, J$e);
        } finally {
            if (J$.Sr(969)) {
                J$.L();
                continue jalangiLabel8;
            } else {
                J$.L();
                break jalangiLabel8;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
