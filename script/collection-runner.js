const newman = require('newman');
const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const collections = [];
const argv = yargs.argv;

async function listDir(dirPath) {
    try {
        return fsPromises.readdir(dirPath);
    } catch (err) {
        console.error('Error occured while reading directory!', err);
    }
}

(function(){
    if (argv.f) {
        newman.run({
            collection: [require(argv.f)],
            reporters: ['htmlextra', 'cli'],
            environment: require('./env.json')
        }, function (er) {
            if (er) { throw er; }
            console.log('collection run complete!');
        })
    } else {
        const collectionsDir = path.join(__dirname, '../collections');
        listDir(collectionsDir).then((teams, err) => {
            if (err)
                throw err;
            try {
                teams.forEach(teamFolder => {
                    let teamCollections = listDir(path.join(__dirname, '../collections/' + teamFolder));
                    collections.push(teamCollections);
                });

                Promise.all(collections).then(files => {
                    const filesWithPath = files.map((file, index)=> file.map(val => path.join(__dirname, '../collections/' + teams[index]) + '/' + val));
                    console.log('############## COLLECTIONS TO RUN #################');
                    console.log(filesWithPath);
                    console.log('###################################################');
                    const collectionsToRequire = filesWithPath.flat().map(val => require(val));

                    newman.run({
                        collection: collectionsToRequire,
                        reporters: ['htmlextra', 'cli'],
                        environment: require('./env.json')
                    }, function (er) {
                        if (er) { throw er; }
                        console.log('collection run complete!');
                    })

                },(error) => {
                    console.error("Error reading collections", error);
                })

            } catch (error) {
                console.error('Error occured while reading directory!', error);
            }
        });
    }
})();
