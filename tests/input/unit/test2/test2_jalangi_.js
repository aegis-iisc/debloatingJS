J$.iids = {"9":[1,14,1,21],"10":[8,13,8,39],"17":[1,22,1,41],"25":[1,14,1,42],"33":[1,14,1,42],"41":[1,14,1,42],"49":[2,12,2,19],"57":[2,20,2,37],"65":[2,12,2,38],"73":[2,12,2,38],"81":[2,12,2,38],"89":[3,13,3,20],"97":[3,21,3,28],"105":[3,13,3,29],"113":[3,13,3,29],"121":[3,13,3,29],"129":[4,13,4,20],"137":[4,21,4,54],"145":[4,13,4,55],"153":[4,13,4,55],"161":[4,13,4,55],"169":[7,12,7,18],"177":[7,24,7,25],"185":[7,12,7,26],"187":[7,12,7,23],"193":[7,12,7,26],"201":[7,12,7,26],"209":[8,1,8,8],"217":[8,13,8,34],"225":[8,35,8,39],"233":[8,1,8,40],"235":[8,1,8,12],"241":[8,1,8,41],"249":[9,1,9,6],"257":[9,17,9,18],"265":[9,20,9,21],"273":[9,1,9,22],"275":[9,1,9,16],"281":[9,1,9,23],"289":[1,1,10,1],"297":[1,1,10,1],"305":[1,1,10,1],"313":[1,1,10,1],"321":[1,1,10,1],"329":[1,1,10,1],"337":[1,1,10,1],"345":[1,1,10,1],"nBranches":0,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2_jalangi_.js","code":"var circle = require('./circle-test2.js');\nvar line = require('./line-test2.js');\nvar https = require('https');\nvar point = require('./test2-innerdir/point-test2.js');\n\n\nvar area = circle.area(2);\nconsole.log(\"Area of the circle \"+area);\npoint.drawPoint(3, 4);\n"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(289, '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2_jalangi_.js', '/home/ashish/work/NEU/jalangi2/project/dynamic/tests/input/unit/test2/test2.js');
            J$.N(297, 'circle', circle, 0);
            J$.N(305, 'line', line, 0);
            J$.N(313, 'https', https, 0);
            J$.N(321, 'point', point, 0);
            J$.N(329, 'area', area, 0);
            var circle = J$.X1(41, J$.W(33, 'circle', J$.F(25, J$.R(9, 'require', require, 2), 0)(J$.T(17, './circle-test2.js', 21, false)), circle, 3));
            var line = J$.X1(81, J$.W(73, 'line', J$.F(65, J$.R(49, 'require', require, 2), 0)(J$.T(57, './line-test2.js', 21, false)), line, 3));
            var https = J$.X1(121, J$.W(113, 'https', J$.F(105, J$.R(89, 'require', require, 2), 0)(J$.T(97, 'https', 21, false)), https, 3));
            var point = J$.X1(161, J$.W(153, 'point', J$.F(145, J$.R(129, 'require', require, 2), 0)(J$.T(137, './test2-innerdir/point-test2.js', 21, false)), point, 3));
            var area = J$.X1(201, J$.W(193, 'area', J$.M(185, J$.R(169, 'circle', circle, 1), 'area', 0)(J$.T(177, 2, 22, false)), area, 3));
            J$.X1(241, J$.M(233, J$.R(209, 'console', console, 2), 'log', 0)(J$.B(10, '+', J$.T(217, "Area of the circle ", 21, false), J$.R(225, 'area', area, 1), 0)));
            J$.X1(281, J$.M(273, J$.R(249, 'point', point, 1), 'drawPoint', 0)(J$.T(257, 3, 22, false), J$.T(265, 4, 22, false)));
        } catch (J$e) {
            J$.Ex(337, J$e);
        } finally {
            if (J$.Sr(345)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
