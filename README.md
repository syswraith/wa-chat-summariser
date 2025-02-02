# Context
- iOS 18.3 update brings Apple Intelligence features to iPhone
- In a move to bring the much awaited AI-enabled features to the iPhone, Apple rushes prototypes into production.
- The result:
insert images here
- The result: Apple rolls back Apple Intelligence features not even n months after releasing them!

# The Idea
- Android fanboys - hacking together open-source technologies* - to make something a bit better
- Codebase is based on open-source technologies and is available under a MIT license on GitHub
## What it is
- A prototype product trying to solve the "hallucinating" problem that Apple Intelligence suffered from
- A project that is based off of open-source technologies* that can be hosted locally
- A chat summariser that is able to read WhatsApp chats
## What it is not
- An Android application
- A drop-in replacement for existing notification services (those will always retain their place)

# Specifications
- Active internet connection with no funny DNS rules set
- A computer running GNU/Linux-based operating system 
- Nvidia RTX 4060

# Tools used in this project
- Ollama = An open-tool that faciliates testing of LLMs locally
- Deepseek-r1:7b = Top-of-the-line, chain-of-thought, open-source LLM model!
- ntfy.sh = HTTP-based notification service utilising a REST API 
- Node.js = Everyone's favourite JavaScript runtime! (Deno and Bun heretics look away please)
    - axios = To make http requests
    - whatsapp-web.js = Unofficial WhatsApp Web client library for Node.js (an official API is available but is paid and for businesses only)
    - ollama = A library to interact with the Ollama API
