import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunksPath = path.join(__dirname, "../data/generatedData/chunks.json");
const postsPath = path.join(__dirname, "../data/generatedData/posts.json");

export async function storeChunksInJSON(chunks) {

    let dataToBeStored = {}

    if (typeof chunks === 'object') {
        dataToBeStored = Array.isArray(chunks) ? { data: chunks } : chunks;
    } else {
        dataToBeStored = { data: chunks }
    }
    
    try {
        await fs.writeFile(
            chunksPath,
            JSON.stringify(dataToBeStored, null, 4),
            "utf-8"
        );
        return true
    } catch (error) {
        console.log("Error in data storing", error)
        return false
    }
}


export async function storePostsInJSON(posts) {

    let dataToBeStored = {}

    if (typeof posts === 'object') {
        dataToBeStored = Array.isArray(posts) ? { data: posts } : posts;
    } else {
        dataToBeStored = { data: posts }
    }
    
    try {
        await fs.writeFile(
            postsPath,
            JSON.stringify(dataToBeStored, null, 4),
            "utf-8"
        );
        return true
    } catch (error) {
        console.log("Error in data storing", error)
        return false
    }
}

