import {promises as fs} from 'fs';
import path from 'path';


function shuffleArray(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const swapIndex = Math.round(Math.random() * i);
        const aux = arr[i];
        arr[i] = arr[swapIndex];
        arr[swapIndex] = aux;
    }
}

export async function getRandomizedPhotosFromFolder(pathToFolder: string){
    const imagePaths = await getRandomizedPhotosFromFolderRecursive(pathToFolder);
    shuffleArray(imagePaths);
    return imagePaths;
}

async function getRandomizedPhotosFromFolderRecursive(pathToFolder: string, basePath = pathToFolder){
    const files = await fs.readdir(pathToFolder, {
        withFileTypes: true
    });
    const images = files.map(f => path.parse(f.name)).filter(f => /jpg$/i.test(f.ext));
            
    let imageSubPaths =  images.map(i => `${pathToFolder}/${i.base}`.substring(basePath.length+1));
    const subFolders = files.filter(dirent => dirent.isDirectory()).map(dirent => path.join(pathToFolder, dirent.name));
    for(let folderPath of subFolders) {
        imageSubPaths = imageSubPaths.concat(await getRandomizedPhotosFromFolderRecursive(folderPath, basePath));
    }

    return imageSubPaths;
}