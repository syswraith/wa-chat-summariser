import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import ollama from 'ollama';
import axios from 'axios';
import { readFile } from 'fs/promises';

const { Client, LocalAuth } = pkg;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => console.log('[STATUS] WhatsApp client is ready'));

const systemPrompt = await readFile('./system_prompt.txt', 'utf-8');

client.on('message_create', async (msg) => {
    if (msg.body.startsWith("!summarise") && msg.fromMe) {
        let message_collection = [];
        let number_of_messages = msg.body.split(" ")[1];
        let chat = await msg.getChat();
        let asc_messages = await chat.fetchMessages({ limit: number_of_messages });

        // Use a for ... of loop instead of forEach
        for (const message of asc_messages) {
            let contact = await message.getContact();
            let contact_name = contact.name;
            message_collection.push(`${message.author} aka ${contact_name} : ${message.body}`);
        }
	message_collection.pop();
	console.log(message_collection.join("\n"))
        console.log("[STATUS] Messages fetched and recorded");

        // AI processing begins here
        console.log("[STATUS] Sending messages to AI...");

        const ai_response = await ollama.generate({
            model: 'deepseek-r1',
            system: systemPrompt.trim(),
            prompt: message_collection.join('\n'),
        });

        let notif_content = ai_response.response.replace(/<think>.*?<\/think>/gs, '').trim();
        console.log("[STATUS] Sending notification via NTFY...");

        // Axios POST request to send the summary
        try {
            const response = await axios.post('https://ntfy.sh/feychat', notif_content, {
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

