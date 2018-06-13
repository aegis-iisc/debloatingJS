J$.iids = {"9":[2,14,2,21],"10":[8,12,8,28],"17":[2,22,2,39],"18":[8,12,8,37],"25":[2,14,2,40],"33":[2,14,2,40],"41":[2,14,2,40],"49":[3,15,3,21],"57":[3,32,3,34],"65":[3,15,3,34],"73":[3,15,3,34],"81":[3,15,3,34],"89":[4,14,4,18],"97":[4,14,4,18],"105":[4,14,4,18],"113":[6,1,6,8],"121":[7,5,7,9],"129":[7,19,7,25],"137":[7,5,7,26],"139":[7,5,7,18],"145":[7,5,7,27],"153":[8,12,8,16],"161":[8,12,8,19],"169":[8,22,8,28],"177":[8,31,8,37],"185":[8,12,8,37],"193":[8,5,8,38],"201":[6,16,10,2],"209":[6,16,10,2],"217":[6,16,10,2],"225":[6,16,10,2],"233":[6,1,10,2],"241":[6,1,10,3],"249":[13,5,13,12],"257":[13,17,13,34],"265":[13,5,13,35],"267":[13,5,13,16],"273":[13,5,13,36],"281":[11,1,15,2],"289":[11,1,15,2],"297":[17,1,17,8],"305":[17,27,17,42],"313":[17,1,17,42],"321":[17,1,17,43],"329":[1,1,19,1],"337":[1,1,19,1],"345":[1,1,19,1],"353":[1,1,19,1],"361":[11,1,15,2],"369":[1,1,19,1],"377":[6,16,10,2],"385":[6,16,10,2],"393":[11,1,15,2],"401":[11,1,15,2],"409":[1,1,19,1],"417":[1,1,19,1],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/circle-test2.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/circle-test2_jalangi_.js","code":"\nconst line = require(\"./line-test2.js\");\nvar exports = module.exports = {};\nconst math = Math;\n\nexports.area = function (radius) {\n    line.drawLine(radius);\n    return math.PI * radius * radius;\n\n};\nfunction unused_function(){\n\n    console.log(\"Unused Function\");\n\n}\n\nexports.unused_function = unused_function;\n\n"};
jalangiLabel3:
    while (true) {
        try {
            J$.Se(329, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/circle-test2_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/circle-test2.js');
            function unused_function() {
                jalangiLabel2:
                    while (true) {
                        try {
                            J$.Fe(281, arguments.callee, this, arguments);
                            arguments = J$.N(289, 'arguments', arguments, 4);
                            J$.X1(273, J$.M(265, J$.R(249, 'console', console, 2), 'log', 0)(J$.T(257, "Unused Function", 21, false)));
                        } catch (J$e) {
                            J$.Ex(393, J$e);
                        } finally {
                            if (J$.Fr(401))
                                continue jalangiLabel2;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(337, 'line', line, 0);
            J$.N(345, 'exports', exports, 0);
            J$.N(353, 'math', math, 0);
            unused_function = J$.N(369, 'unused_function', J$.T(361, unused_function, 12, false, 281), 0);
            const line = J$.X1(41, J$.W(33, 'line', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, "./line-test2.js", 21, false)), line, 3));
            var exports = J$.X1(81, J$.W(73, 'exports', J$.P(65, J$.R(49, 'module', module, 2), 'exports', J$.T(57, {}, 11, false), 0), exports, 3));
            const math = J$.X1(105, J$.W(97, 'math', J$.R(89, 'Math', Math, 2), math, 3));
            J$.X1(241, J$.P(233, J$.R(113, 'exports', exports, 1), 'area', J$.T(225, function (radius) {
                jalangiLabel1:
                    while (true) {
                        try {
                            J$.Fe(201, arguments.callee, this, arguments);
                            arguments = J$.N(209, 'arguments', arguments, 4);
                            radius = J$.N(217, 'radius', radius, 4);
                            J$.X1(145, J$.M(137, J$.R(121, 'line', line, 1), 'drawLine', 0)(J$.R(129, 'radius', radius, 0)));
                            return J$.X1(193, J$.Rt(185, J$.B(18, '*', J$.B(10, '*', J$.G(161, J$.R(153, 'math', math, 1), 'PI', 0), J$.R(169, 'radius', radius, 0), 0), J$.R(177, 'radius', radius, 0), 0)));
                        } catch (J$e) {
                            J$.Ex(377, J$e);
                        } finally {
                            if (J$.Fr(385))
                                continue jalangiLabel1;
                            else
                                return J$.Ra();
                        }
                    }
            }, 12, false, 201), 0));
            J$.X1(321, J$.P(313, J$.R(297, 'exports', exports, 1), 'unused_function', J$.R(305, 'unused_function', unused_function, 1), 0));
        } catch (J$e) {
            J$.Ex(409, J$e);
        } finally {
            if (J$.Sr(417)) {
                J$.L();
                continue jalangiLabel3;
            } else {
                J$.L();
                break jalangiLabel3;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
