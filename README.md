# Locial

Turn long-form markdown into social-style posts and preview them across platform-specific feeds.

Locial ingests a source document, splits it into semantic chunks, rewrites each chunk with Mistral AI in a random writing personality, and renders the results in mock UIs for Twitter, Instagram, Reddit, LinkedIn, and WhatsApp.

## How it works

```
Markdown file → semantic chunking → AI rewrite (Mistral) → JSON output → platform UIs
```

1. **Ingest** — Read a markdown file and chunk it with [semantic-chunking](https://www.npmjs.com/package/semantic-chunking) (uses a local embedding model).
2. **Rewrite** — For each chunk, pick a random personality from `AiReWrite/personalities.json` and ask Mistral to rewrite the text in that voice while preserving facts.
3. **Store** — Save chunks and posts to `data/generatedData/`.
4. **Preview** — Open the HTML feeds in `UIs/` to see posts styled like real social platforms.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [Mistral API key](https://console.mistral.ai/)

## Setup

```bash
npm install
```

Copy the example env file and add your key:

```bash
cp .env.example .env
```

Then set `MISTRAL_API_KEY` in `.env`.

On first run, semantic-chunking will download a local embedding model into `models/` (~24 MB). This is gitignored and cached locally.

## Usage

### 1. Run ingestion

```bash
node ingest.ts data/san_francisco.md
```

Replace the path with any markdown file you want to process. The script will:

- Chunk the document
- Generate one rewritten post per chunk
- Write output to `data/generatedData/chunks.json` and `data/generatedData/posts.json`

### 2. Preview in the UIs

The HTML files load generated data via `fetch`, so serve the project over HTTP:

```bash
npx serve .
```

Then open any feed in your browser:

- [UIs/twitter.html](UIs/twitter.html)
- [UIs/instagram.html](UIs/instagram.html)
- [UIs/reddit.html](UIs/reddit.html)
- [UIs/linkedin.html](UIs/linkedin.html)
- [UIs/whatsapp.html](UIs/whatsapp.html)

## Project structure

```
locial/
├── ingest.ts                  # Main entry point
├── parsers/md.parser.ts       # Semantic chunking
├── reader/md.reader.ts        # Markdown file reader
├── postDataGenerator/         # AI post generation
├── models_for_posts/mistrel.ts # Mistral API client
├── store/store.ts             # JSON output
├── AiReWrite/
│   └── personalities.json     # 10 writing personalities
├── data/
│   ├── san_francisco.md       # Sample source document
│   └── generatedData/         # Generated chunks & posts (gitignored)
├── UIs/                       # Platform feed mockups
└── models/                    # Cached embedding model (gitignored)
```

## Personalities

Each chunk is rewritten using one of 10 predefined personalities, such as *Late Night Founder*, *Internet Philosopher*, *Builder in Public*, and *Signal Over Noise*. Edit `AiReWrite/personalities.json` to add or customize voices.

## License

ISC
