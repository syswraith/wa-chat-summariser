import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => console.log('Client is ready!'));

client.on('message_create', async msg => {
    console.log(msg.body)
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));

client.initialize();

