import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import ollama from 'ollama';
import axios from 'axios';

const { Client, LocalAuth } = pkg;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => console.log('[STATUS] WhatsApp client is ready'));

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
	console.log("[STATUS] Messages fetched and recorded")

	// ai voodoo magic begins here

	console.log("[STATUS] Sending messages to AI...")
	const ai_response = await ollama.chat({
	    model: 'deepseek-r1',
	    messages: [{ role: 'system', content: ( message_collection.join('\n') + '\n\n Summarise this chat in 395 characters.' ) }], 
	})
	
	let notif_content = ai_response.message.content.replace(/<think>.*?<\/think>/gs, '').trim()
	console.log("[STATUS] Sending notification via NTFY...")
	
	// axios POST
	
	try {
	    const response = await axios.post('https://ntfy.sh/feycomm', notif_content, {
		headers: {
		    'Title': 'WhatsApp summary',
		    'Priority': 'high',
		},
	    });
	    console.log('[STATUS] Notification sent: ', response.data.message);
	} catch (error) {
	    console.error('[STATUS] Error sending notification: ', error);
	}


    }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.initialize();

