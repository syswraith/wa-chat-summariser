import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => console.log('Client is ready!'));

client.on('message_create', async msg => {
    if (msg.body.startsWith("!summarise") && msg.fromMe)
    {
	let number_of_messages = msg.body.split(" ")[1]
	let chat = await msg.getChat()
	let asc_messages = await chat.fetchMessages({limit: number_of_messages})
    }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.initialize();

