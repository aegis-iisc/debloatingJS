J$.iids = {"9":[3,14,3,21],"10":[10,13,10,45],"17":[3,22,3,51],"18":[10,13,10,60],"25":[3,14,3,52],"26":[10,13,10,65],"33":[3,14,3,52],"34":[10,13,10,85],"41":[3,14,3,52],"42":[10,13,10,95],"49":[4,13,4,20],"57":[4,21,4,28],"65":[4,13,4,29],"73":[4,13,4,29],"81":[4,13,4,29],"89":[5,10,5,11],"97":[5,10,5,11],"105":[5,1,5,12],"113":[6,8,6,14],"121":[6,20,6,26],"129":[6,8,6,27],"131":[6,8,6,19],"137":[6,8,6,27],"145":[6,1,6,28],"153":[7,13,7,19],"161":[7,30,7,36],"169":[7,13,7,37],"171":[7,13,7,29],"177":[7,13,7,37],"185":[7,1,7,38],"193":[8,8,8,14],"201":[8,28,8,34],"209":[8,8,8,35],"211":[8,8,8,27],"217":[8,8,8,35],"225":[8,1,8,35],"233":[10,1,10,8],"241":[10,13,10,38],"249":[10,39,10,45],"257":[10,48,10,60],"265":[10,61,10,65],"273":[10,68,10,85],"281":[10,86,10,95],"289":[10,1,10,96],"291":[10,1,10,12],"297":[10,1,10,97],"305":[15,11,15,17],"313":[15,19,15,23],"321":[15,25,15,34],"329":[15,10,15,35],"337":[15,10,15,35],"345":[15,1,15,36],"353":[20,2,20,8],"361":[20,9,20,15],"369":[20,19,20,25],"377":[20,2,20,25],"385":[20,2,20,26],"393":[21,2,21,8],"401":[21,9,21,13],"409":[21,17,21,23],"417":[21,31,21,35],"425":[21,31,21,42],"433":[21,17,21,43],"435":[21,17,21,28],"441":[21,2,21,43],"449":[21,2,21,44],"457":[22,2,22,8],"465":[22,9,22,18],"473":[22,22,22,28],"481":[22,39,22,43],"489":[22,39,22,50],"497":[22,22,22,51],"499":[22,22,22,38],"505":[22,2,22,51],"513":[22,2,22,52],"521":[18,1,26,2],"529":[18,1,26,2],"537":[18,1,26,2],"545":[27,1,27,12],"553":[27,13,27,19],"561":[27,1,27,20],"569":[27,1,27,21],"577":[29,1,29,7],"585":[29,19,29,25],"593":[29,26,29,32],"601":[29,19,29,33],"609":[29,1,29,34],"611":[29,1,29,18],"617":[29,1,29,35],"625":[1,1,35,1],"633":[1,1,35,1],"641":[1,1,35,1],"649":[18,1,26,2],"657":[1,1,35,1],"665":[18,1,26,2],"673":[18,1,26,2],"681":[1,1,35,1],"689":[1,1,35,1],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test-loading-semantics.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test-loading-semantics_jalangi_.js","code":"\t/* Comments */\n\nvar circle = require('./exported_circle_second.js');\nvar https = require('https');\nradius = 2;\narea = circle.area(radius);\nperimeter = circle.perimeter(radius);\nisNT = circle.isNontrivial(radius)\n\nconsole.log(\"The circle with radius \"+radius + \" has Area \"+area + \" and Perimeter \"+perimeter);\n//const url = \"https://maps.googleapis.com/maps/api/geocode/json?address=Florence\";\n\n//console.log(\"HTTPS \"+https.toString());\n\nCircle = {radius, area, perimeter};\n\n\nfunction makeACircle (radius){\n\n\tCircle[radius] = radius;\n\tCircle[area] = circle.area ( this.radius);\n\tCircle[perimeter] = circle.perimeter(this.radius);\n\t\n\t\n\t\n}\nmakeACircle(radius);\n\ncircle.drawCircle(Circle[radius]);\n\n\n\n\n\n"};
jalangiLabel1:
    while (true) {
        try {
            J$.Se(625, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test-loading-semantics_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test-loading-semantics.js');
            function makeACircle(radius) {
                jalangiLabel0:
                    while (true) {
                        try {
                            J$.Fe(521, arguments.callee, this, arguments);
                            arguments = J$.N(529, 'arguments', arguments, 4);
                            radius = J$.N(537, 'radius', radius, 4);
                            J$.X1(385, J$.P(377, J$.R(353, 'Circle', Circle, 2), J$.R(361, 'radius', radius, 0), J$.R(369, 'radius', radius, 0), 2));
                            J$.X1(449, J$.P(441, J$.R(393, 'Circle', Circle, 2), J$.R(401, 'area', area, 2), J$.M(433, J$.R(409, 'circle', circle, 1), 'area', 0)(J$.G(425, J$.R(417, 'this', this, 0), 'radius', 0)), 2));
                            J$.X1(513, J$.P(505, J$.R(457, 'Circle', Circle, 2), J$.R(465, 'perimeter', perimeter, 2), J$.M(497, J$.R(473, 'circle', circle, 1), 'perimeter', 0)(J$.G(489, J$.R(481, 'this', this, 0), 'radius', 0)), 2));
                        } catch (J$e) {
                            J$.Ex(665, J$e);
                        } finally {
                            if (J$.Fr(673))
                                continue jalangiLabel0;
                            else
                                return J$.Ra();
                        }
                    }
            }
            J$.N(633, 'circle', circle, 0);
            J$.N(641, 'https', https, 0);
            makeACircle = J$.N(657, 'makeACircle', J$.T(649, makeACircle, 12, false, 521), 0);
            var circle = J$.X1(41, J$.W(33, 'circle', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, './exported_circle_second.js', 21, false)), circle, 3));
            var https = J$.X1(81, J$.W(73, 'https', J$.F(65, J$.R(49, 'require', require, 2), 0)(J$.T(57, 'https', 21, false)), https, 3));
            J$.X1(105, radius = J$.W(97, 'radius', J$.T(89, 2, 22, false), J$.I(typeof radius === 'undefined' ? undefined : radius), 4));
            J$.X1(145, area = J$.W(137, 'area', J$.M(129, J$.R(113, 'circle', circle, 1), 'area', 0)(J$.R(121, 'radius', radius, 2)), J$.I(typeof area === 'undefined' ? undefined : area), 4));
            J$.X1(185, perimeter = J$.W(177, 'perimeter', J$.M(169, J$.R(153, 'circle', circle, 1), 'perimeter', 0)(J$.R(161, 'radius', radius, 2)), J$.I(typeof perimeter === 'undefined' ? undefined : perimeter), 4));
            J$.X1(225, isNT = J$.W(217, 'isNT', J$.M(209, J$.R(193, 'circle', circle, 1), 'isNontrivial', 0)(J$.R(201, 'radius', radius, 2)), J$.I(typeof isNT === 'undefined' ? undefined : isNT), 4));
            J$.X1(297, J$.M(289, J$.R(233, 'console', console, 2), 'log', 0)(J$.B(42, '+', J$.B(34, '+', J$.B(26, '+', J$.B(18, '+', J$.B(10, '+', J$.T(241, "The circle with radius ", 21, false), J$.R(249, 'radius', radius, 2), 0), J$.T(257, " has Area ", 21, false), 0), J$.R(265, 'area', area, 2), 0), J$.T(273, " and Perimeter ", 21, false), 0), J$.R(281, 'perimeter', perimeter, 2), 0)));
            J$.X1(345, Circle = J$.W(337, 'Circle', J$.T(329, {
                radius,
                area,
                perimeter
            }, 11, false), J$.I(typeof Circle === 'undefined' ? undefined : Circle), 4));
            J$.X1(569, J$.F(561, J$.R(545, 'makeACircle', makeACircle, 1), 0)(J$.R(553, 'radius', radius, 2)));
            J$.X1(617, J$.M(609, J$.R(577, 'circle', circle, 1), 'drawCircle', 0)(J$.G(601, J$.R(585, 'Circle', Circle, 2), J$.R(593, 'radius', radius, 2), 4)));
        } catch (J$e) {
            J$.Ex(681, J$e);
        } finally {
            if (J$.Sr(689)) {
                J$.L();
                continue jalangiLabel1;
            } else {
                J$.L();
                break jalangiLabel1;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
