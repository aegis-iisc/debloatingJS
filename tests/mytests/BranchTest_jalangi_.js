J$.iids = {"8":[3,6,3,17],"9":[1,12,1,13],"10":[1,15,1,21],"16":[1,15,1,21],"17":[1,12,1,13],"18":[1,24,1,27],"25":[1,12,1,13],"33":[1,15,1,16],"34":[1,24,1,27],"41":[1,19,1,21],"42":[2,14,2,41],"50":[3,6,3,11],"57":[1,24,1,25],"58":[3,6,3,17],"65":[1,24,1,27],"81":[2,2,2,9],"89":[2,14,2,37],"97":[2,40,2,41],"105":[2,2,2,42],"107":[2,2,2,13],"113":[2,2,2,43],"121":[3,6,3,7],"129":[3,10,3,11],"137":[3,16,3,17],"145":[4,3,4,10],"153":[4,15,4,21],"161":[4,3,4,22],"163":[4,3,4,14],"169":[4,3,4,23],"177":[8,3,8,10],"185":[8,15,8,20],"193":[8,3,8,21],"195":[8,3,8,14],"201":[8,3,8,22],"209":[1,1,14,1],"217":[1,1,14,1],"225":[3,2,9,3],"233":[1,1,13,2],"241":[1,1,13,2],"249":[1,1,14,1],"257":[1,1,14,1],"nBranches":4,"originalCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/mytests/BranchTest.js","instrumentedCodeFileName":"/home/ashish/work/NEU/jalangi2/tests/pldi16/mytests/BranchTest_jalangi_.js","code":"for (var i=0; i < 10 ; i++){\n\tconsole.log(\"For loop iteration # \" + i);\n\tif( i % 2 === 0 ){\n\t\tconsole.log(\"Even\");\n\t\n\t}else {\n\n\t\tconsole.log(\"Odd\");\n\t}\n\t\n\n\n}\n"};
jalangiLabel0:
    while (true) {
        try {
            J$.Se(209, '/home/ashish/work/NEU/jalangi2/tests/pldi16/mytests/BranchTest_jalangi_.js', '/home/ashish/work/NEU/jalangi2/tests/pldi16/mytests/BranchTest.js');
            J$.N(217, 'i', i, 0);
            for (var i = J$.X1(25, J$.W(17, 'i', J$.T(9, 0, 22, false), i, 3)); J$.X1(233, J$.C(16, J$.B(10, '<', J$.R(33, 'i', i, 1), J$.T(41, 10, 22, false), 0))); J$.X1(241, J$.B(34, '-', i = J$.W(65, 'i', J$.B(26, '+', J$.U(18, '+', J$.R(57, 'i', i, 1)), J$.T(49, 1, 22, false), 0), i, 2), J$.T(73, 1, 22, false), 0))) {
                J$.X1(113, J$.M(105, J$.R(81, 'console', console, 2), 'log', 0)(J$.B(42, '+', J$.T(89, "For loop iteration # ", 21, false), J$.R(97, 'i', i, 1), 0)));
                if (J$.X1(225, J$.C(8, J$.B(58, '===', J$.B(50, '%', J$.R(121, 'i', i, 1), J$.T(129, 2, 22, false), 0), J$.T(137, 0, 22, false), 0)))) {
                    J$.X1(169, J$.M(161, J$.R(145, 'console', console, 2), 'log', 0)(J$.T(153, "Even", 21, false)));
                } else {
                    J$.X1(201, J$.M(193, J$.R(177, 'console', console, 2), 'log', 0)(J$.T(185, "Odd", 21, false)));
                }
            }
        } catch (J$e) {
            J$.Ex(249, J$e);
        } finally {
            if (J$.Sr(257)) {
                J$.L();
                continue jalangiLabel0;
            } else {
                J$.L();
                break jalangiLabel0;
            }
        }
    }
// JALANGI DO NOT INSTRUMENT
