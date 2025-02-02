import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import ollama from 'ollama'

const { Client, LocalAuth } = pkg;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => console.log('Client is ready!'));

client.on('message_create', async msg => {
    if (msg.body.startsWith("!summarise") && msg.fromMe)
    {
	let message_collection = [];
	let number_of_messages = msg.body.split(" ")[1]
	let chat = await msg.getChat()
	let asc_messages = await chat.fetchMessages({limit: number_of_messages})
	asc_messages.forEach((message)=>{
	    message_collection.push(`${message.author}: ${message.body}`)
	})

	console.log("messages fetched and recorded")
	console.log("now beginning ai voodoo magic")

	// ai voodoo magic begins here

        const ai_response = await ollama.chat({
            model: 'deepseek-r1',
            messages: [{ role: 'system', content: ( message_collection.join('\n') + '\n\n Summarise this chat in 3 lines' ) }], 
        })

	console.log("sent the messages to ai")

	console.log(ai_response.message.content.replace(/<think>.*?<\/think>/gs, '').trim())
    }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.initialize();

