function add () {
    var counter = 0;
    function plus() {counter += 1;}
    // plus();
    return counter;
}
function sub (x, y) {
    return x - y;
}
console.log(add());