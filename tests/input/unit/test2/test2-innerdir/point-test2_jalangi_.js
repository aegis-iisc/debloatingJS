J$.iids = {"8":[18,19,18,24],"9":[1,15,1,21],"10":[16,18,16,23],"16":[16,18,16,23],"17":[1,32,1,34],"18":[16,26,16,29],"25":[1,15,1,34],"33":[1,15,1,34],"34":[16,26,16,29],"41":[1,15,1,34],"42":[18,19,18,24],"49":[4,1,4,8],"50":[18,27,18,30],"57":[6,2,6,9],"65":[6,14,6,29],"66":[18,27,18,30],"73":[6,2,6,30],"74":[20,8,20,11],"75":[6,2,6,13],"81":[6,2,6,31],"82":[23,7,23,12],"89":[4,17,8,2],"97":[4,17,8,2],"105":[4,17,8,2],"113":[4,17,8,2],"121":[4,17,8,2],"129":[4,1,8,2],"137":[4,1,8,3],"145":[11,1,11,8],"153":[13,17,13,18],"161":[13,17,13,18],"169":[13,17,13,18],"177":[14,17,14,18],"185":[14,17,14,18],"193":[14,17,14,18],"201":[16,15,16,16],"209":[16,15,16,16],"217":[16,15,16,16],"225":[16,18,16,19],"233":[16,22,16,23],"249":[16,26,16,27],"257":[16,26,16,29],"273":[17,3,17,10],"281":[17,15,17,19],"289":[17,3,17,20],"291":[17,3,17,14],"297":[17,3,17,21],"305":[18,16,18,17],"313":[18,16,18,17],"321":[18,16,18,17],"329":[18,19,18,20],"337":[18,23,18,24],"353":[18,27,18,28],"361":[18,27,18,30],"377":[19,4,19,11],"385":[19,16,19,20],"393":[19,4,19,21],"395":[19,4,19,15],"401":[19,4,19,22],"409":[20,8,20,9],"417":[20,10,20,11],"425":[20,8,20,11],"433":[20,4,20,12],"441":[23,7,23,8],"449":[23,11,23,12],"457":[23,7,23,12],"465":[23,3,23,13],"473":[25,2,25,9],"481":[25,14,25,17],"489":[25,2,25,18],"491":[25,2,25,13],"497":[25,2,25,19],"505":[11,21,27,2],"513":[11,21,27,2],"521":[11,21,27,2],"529":[11,21,27,2],"537":[11,21,27,2],"545":[11,21,27,2],"553":[11,21,27,2],"561":[11,21,27,2],"569":[11,21,27,2],"577":[11,1,27,2],"585":[11,1,27,3],"593":[30,1,30,8],"601":[30,19,30,20],"609":[30,21,30,22],"617":[30,1,30,23],"619":[30,1,30,18],"625":[30,1,30,24],"633":[1,1,31,1],"641":[1,1,31,1],"649":[4,17,8,2],"657":[4,17,8,2],"665":[18,3,21,4],"673":[18,3,21,4],"681":[16,2,24,3],"689":[16,2,24,3],"697":[11,21,27,2],"705":[11,21,27,2],"713":[1,1,31,1],"721":[1,1,31,1],"nBranches":4,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2-innerdir/point-test2.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2-innerdir/point-test2_jalangi_.js","code":"var exports = module.exports = {};\n\n\nexports.point = function (x , y){\n\n\tconsole.log(\"a point (x,y)\");\n\n};\n\n\nexports.drawPoint = function (x, y){\n\n\tvar origin_x = 0;\n\tvar origin_y = 0;\n\n\tfor( var i = 0; i < x ; i++){\n\t\tconsole.log(\"\\n\");\n\t\tfor (var j = 0; j < y ; j++){\n\t\t\tconsole.log(\"\\t\");\n\t\t\tj = j+1;\n\t\t}\n\t\t\n\t\ti = i + 1;\n\t}\n\tconsole.log(\".\");\t\n\n}; \n\n\nexports.drawPoint(3,4);\n"};
jalangiLabel10:
    while (true) {
        try {
            J$.Se(633, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2-innerdir/point-test2_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2-innerdir/point-test2.js');
            J$.N(641, 'exports', exports, 0);
            var exports = J$.X1(41, J$.W(33, 'exports', J$.P(25, J$.R(9, 'module', module, 2), 'exports', J$.T(17, {}, 11, false), 0), exports, 3));
            J$.X1(137, J$.P(129, J$.R(49, 'exports', exports, 1), 'point', J$.T(121, function (x, y) {
                jalangiLabel8:
                    while (true) {
                        try {
                            J$.Fe(89, arguments.callee, this, arguments);
                            arguments = J$.N(97, 'arguments', arguments, 4);
                            x = J$.N(105, 'x', x, 4);
                            y = J$.N(113, 'y', y, 4);
                            J$.X1(81, J$.M(73, J$.R(57, 'console', console, 2), 'log', 0)(J$.T(65, "a point (x,y)", 21, false)));
                        } catch (J$e) {
                            J$.Ex(649, J$e);
                        } finally {
                            if (J$.Fr(657))
                                continue jalangiLabel8;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 89), 0));
            J$.X1(585, J$.P(577, J$.R(145, 'exports', exports, 1), 'drawPoint', J$.T(569, function (x, y) {
                jalangiLabel9:
                    while (true) {
                        try {
                            J$.Fe(505, arguments.callee, this, arguments);
                            arguments = J$.N(513, 'arguments', arguments, 4);
                            x = J$.N(521, 'x', x, 4);
                            y = J$.N(529, 'y', y, 4);
                            J$.N(537, 'origin_x', origin_x, 0);
                            J$.N(545, 'origin_y', origin_y, 0);
                            J$.N(553, 'i', i, 0);
                            J$.N(561, 'j', j, 0);
                            var origin_x = J$.X1(169, J$.W(161, 'origin_x', J$.T(153, 0, 22, false), origin_x, 1));
                            var origin_y = J$.X1(193, J$.W(185, 'origin_y', J$.T(177, 0, 22, false), origin_y, 1));
                            for (var i = J$.X1(217, J$.W(209, 'i', J$.T(201, 0, 22, false), i, 1)); J$.X1(681, J$.C(16, J$.B(10, '<', J$.R(225, 'i', i, 0), J$.R(233, 'x', x, 0), 0))); J$.X1(689, J$.B(34, '-', i = J$.W(257, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(249, 'i', i, 0)), J$.T(241, 1, 22, false), 0), i, 0), J$.T(265, 1, 22, false), 0))) {
                                J$.X1(297, J$.M(289, J$.R(273, 'console', console, 2), 'log', 0)(J$.T(281, "\n", 21, false)));
                                for (var j = J$.X1(321, J$.W(313, 'j', J$.T(305, 0, 22, false), j, 1)); J$.X1(665, J$.C(8, J$.B(42, '<', J$.R(329, 'j', j, 0), J$.R(337, 'y', y, 0), 0))); J$.X1(673, J$.B(66, '-', j = J$.W(361, 'j', J$.B(58, '+', J$.U(50, '+', J$.R(353, 'j', j, 0)), J$.T(345, 1, 22, false), 0), j, 0), J$.T(369, 1, 22, false), 0))) {
                                    J$.X1(401, J$.M(393, J$.R(377, 'console', console, 2), 'log', 0)(J$.T(385, "\t", 21, false)));
                                    J$.X1(433, j = J$.W(425, 'j', J$.B(74, '+', J$.R(409, 'j', j, 0), J$.T(417, 1, 22, false), 0), j, 0));
                                }
                                J$.X1(465, i = J$.W(457, 'i', J$.B(82, '+', J$.R(441, 'i', i, 0), J$.T(449, 1, 22, false), 0), i, 0));
                            }
                            J$.X1(497, J$.M(489, J$.R(473, 'console', console, 2), 'log', 0)(J$.T(481, ".", 21, false)));
                        } catch (J$e) {
                            J$.Ex(697, J$e);
                        } finally {
                            if (J$.Fr(705))
                                continue jalangiLabel9;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 505), 0));
            J$.X1(625, J$.M(617, J$.R(593, 'exports', exports, 1), 'drawPoint', 0)(J$.T(601, 3, 22, false), J$.T(609, 4, 22, false)));
        } catch (J$e) {
            J$.Ex(713, J$e);
        } finally {
            if (J$.Sr(721)) {
                J$.L();
                continue jalangiLabel10;
            } else {
                J$.L();
                break jalangiLabel10;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
