var fs = require('fs');
var path = require('path');
var childProcess = require('child_process');

var allSpecsRootDir = path.resolve(__dirname, 'specs');
var allPotentialSpecDirNames = fs.readdirSync(allSpecsRootDir);
allPotentialSpecDirNames.forEach(function (potentialSpecDirName) {
    var potentialSpecDir = path.resolve(allSpecsRootDir, potentialSpecDirName);
    if (fs.statSync(potentialSpecDir).isDirectory() && /^less@/.test(potentialSpecDirName)) {
        childProcess.execSync('node ./test/run.js', {
            env: Object.assign({}, process.env, {
                LESS_VERSION: potentialSpecDirName
            }),
            stdio: 'inherit'
        });
    }
});
