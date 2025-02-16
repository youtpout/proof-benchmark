import fs from 'fs/promises';
import { Cache } from 'o1js';
import { Add } from './Add.js';
import path from 'path';

// node build/src/cache.js

const cache = Cache.FileSystem('./cache');
for (let index = 0; index < 6; index++) {
    // compile 3 time to get all files
    await Add.compile({ cache });
}

const folder = await fs.readdir("./cache");

const filter = (x: string) => { return x.indexOf('-pk-') === -1 && x.indexOf('.header') === -1 };
// we will filter pk directly on the frontend
//const filter = (x: string) => { return x.indexOf('.header') === -1 };
const fileName = folder.filter(filter);
const json = JSON.stringify(fileName);


await fs.cp('./cache', '../ui/public/cache', {
    recursive: true, filter: (source, _destination) => {
        return filter(source);
    }
});


const folderPath = '../ui/public/cache';
let filesArr = await fs.readdir(folderPath);

// Loop through array and rename all files 
filesArr.forEach(async (file) => {
    let fullPath = path.join(folderPath, file);
    let fileExtension = path.extname(file);
    let fileName = path.basename(file, fileExtension);

    // we use textfile to get browser compression
    let newFileName = fileName + ".txt";
    try {
        await fs.rename(fullPath, path.join(folderPath, newFileName));
    } catch (error) {
        console.error(error)
    }
});

await fs.writeFile('../ui/public/compiled.json', json, 'utf8');