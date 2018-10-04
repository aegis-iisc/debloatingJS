/* eslint no-console:0 */

'use strict';

// fetch url and update charset to utf-8
const fetchUrl = require('../lib/fetch').fetchUrl;

fetchUrl('http://kreata.ee/iso-8859-15.php', (error, meta, body) => {
    if (error) {
        return console.log('ERROR', error.message || error);
    }

    console.log('META INFO');
    console.log(meta);

    console.log('BODY');
    console.log(body.toString('utf-8'));
});
