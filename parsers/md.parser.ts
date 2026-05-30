import { chunkit } from 'semantic-chunking';



export async function parseMdFile(fileContent) {
    
    const documents = [
        { document_name: "san_francisco.md", document_text: fileContent }
    ]
    const chunkitOptions = {};
    const chunks = await chunkit(documents, chunkitOptions);   
    return chunks
}