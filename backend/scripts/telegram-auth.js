import dotenv from 'dotenv';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input';

dotenv.config();

const apiId = parseInt(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;
const phoneNumber = process.env.TELEGRAM_PHONE;

console.log('🔐 Telegram Authentication');
console.log('API ID:', apiId);
console.log('Phone:', phoneNumber);
console.log('---');

const session = new StringSession('');
const client = new TelegramClient(session, apiId, apiHash, {
  connectionRetries: 5,
});

async function main() {
  console.log('📱 Starting Telegram authentication...');
  console.log('📩 SMS will be sent to:', phoneNumber);
  
  await client.start({
    phoneNumber: async () => phoneNumber,
    password: async () => {
      console.log('🔒 2FA is enabled on your account');
      return await input.text('Please enter your password: ');
    },
    phoneCode: async () => {
      console.log('📬 SMS code has been sent!');
      return await input.text('Please enter the code you received: ');
    },
    onError: (err) => console.log('❌ Error:', err),
  });

  console.log('✅ Successfully connected!');
  console.log('💾 Save this session string to your .env:');
  console.log('TELEGRAM_SESSION=' + client.session.save());
  
  await client.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});

