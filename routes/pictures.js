var multiparty = require('multiparty');
var os = require( 'os');
var fs = require('fs');
const moveFile = require('move-file');
//import { moveFile } from 'move-file';

var express = require('express');
var router = express.Router();

router.route('/')
    .get((req, res) => {

    })
    .post((req, res) => {
        let id = Math.round(new Date().getTime()).toString();
        fs.mkdirSync(os.tmpdir() + '/' + id);
        let form = new multiparty.Form({
            autoFiles: true,
            uploadDir: os.tmpdir() + '/' + id,
        });
        form.parse(req, function (err, fields, files) {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.write(id);
            res.end();
        });
    })

router.route('/submit/')
    .post((req, res) => {
        let form = new multiparty.Form();

        form.parse(req, function (err, fields, files) {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            res.write("ok");
            res.end();
            let id = fields.id[0];
            let filename = fields.filename[0];
            let destinationFolder = fields.folder[0];

            let tmpFolder = os.tmpdir() + "/" + id + "/";
            fs.readdir(tmpFolder, (err, files) => {
                if(err) {
                    return;
                }
                files.forEach(file => {
                    let destName = __dirname + "/" + destinationFolder + filename;
                    (async () => {
                        await moveFile(tmpFolder + file, destName);
                    })();
                });
            });
        });
    })

module.exports = router;