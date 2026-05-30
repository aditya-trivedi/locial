import { parseMdFile } from "./parsers/md.parser.ts";
import { readMarkdownFile } from "./reader/md.reader.ts";
import { storeChunksInJSON, storePostsInJSON } from "./store/store.ts"
import { createPosts } from "./postDataGenerator/postDataGenerator.ts";


async function main() {

    const filePath = process.argv[2];

    console.log("File Path", filePath)

    const fileContent = await readMarkdownFile(filePath)

    console.log("File Content retrieved ", fileContent.length)

    const chunkedContent = await parseMdFile(fileContent)

    console.log("Chunking complete. Chunking length :", chunkedContent.length)

    const isDataStoredSuccessfully = await storeChunksInJSON(chunkedContent)

    if( isDataStoredSuccessfully ){
        console.log("Data stored successfully")
    } else {
        console.log("Error in data storing")
        return;
    }

    const allPosts = await createPosts(chunkedContent)

    const isPostsDataStoredSuccessfully = await storePostsInJSON(allPosts)

    if( isPostsDataStoredSuccessfully ){
        console.log("Post Data stored successfully")
    } else {
        console.log("Error in post data storing")
        return;
    }

    console.log("------------INGESTION COMPLETE------------------")
    
}

main()

