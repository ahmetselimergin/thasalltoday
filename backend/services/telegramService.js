import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input';

class TelegramService {
  constructor() {
    this.client = null;
    // Environment variables'ı constructor'da değil connect'te okuyacağız
  }

  async connect() {
    try {
      if (this.client && this.client.connected) {
        return this.client;
      }

      // Environment variables'ı burada oku - dotenv.config()'ten sonra
      const session = new StringSession(process.env.TELEGRAM_SESSION || '');
      const apiId = parseInt(process.env.TELEGRAM_API_ID);
      const apiHash = process.env.TELEGRAM_API_HASH;
      const phoneNumber = process.env.TELEGRAM_PHONE;

      console.log('🔧 Telegram Config:', {
        apiId: apiId,
        hasApiHash: !!apiHash,
        hasSession: !!process.env.TELEGRAM_SESSION,
        phone: phoneNumber
      });

      this.client = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 5,
      });

      await this.client.start({
        phoneNumber: async () => phoneNumber,
        password: async () => await input.text('Please enter your password: '),
        phoneCode: async () => await input.text('Please enter the code you received: '),
        onError: (err) => console.log(err),
      });

      console.log('✅ Telegram client connected successfully');
      console.log('Session string:', this.client.session.save());
      
      return this.client;
    } catch (error) {
      console.error('❌ Telegram connection error:', error);
      throw error;
    }
  }

  async getTrendingChannels() {
    try {
      // Sadece gerçek Telegram API kullan - Mock data yok!
      console.log('📱 Fetching REAL Telegram data from API...');
      console.log('📋 Environment check:', {
        apiId: !!process.env.TELEGRAM_API_ID,
        apiHash: !!process.env.TELEGRAM_API_HASH,
        session: !!process.env.TELEGRAM_SESSION,
        phone: !!process.env.TELEGRAM_PHONE
      });

      // Bağlantıyı kur
      if (!this.client || !this.client.connected) {
        await this.connect();
      }

      // Popular crypto channels to monitor (Optimized - only ACTIVE channels with recent messages)
      const cryptoChannels = [
        '@glassnode',         // ✅ Active (19/20 messages)
        '@coindesk',          // ✅ Active (20/20 messages)
        '@cointelegraph',     // ✅ Active (20/20 messages)
        '@whale_alert_io',    // ✅ Active (20/20 messages)
        '@bitcoin',           // ✅ Active (20/20 messages)
        '@IntoTheBlock',      // ✅ Active (12/20 messages)
        '@CryptoWhale',       // 🆕 Alternative to whale_alert
        '@Blockworks_',       // 🆕 Active crypto news
        '@TheBlock__',        // 🆕 Active crypto news
        '@Cointelegraph',     // 🆕 Main channel
      ];

      const channelsData = [];

      // Batch processing: 3'lü gruplar halinde fetch (flood wait prevention)
      const batchSize = 3;
      for (let i = 0; i < cryptoChannels.length; i += batchSize) {
        const batch = cryptoChannels.slice(i, i + batchSize);
        console.log(`🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(cryptoChannels.length / batchSize)}`);
        
        // Batch içindeki kanalları paralel çek
        const batchPromises = batch.map(async (channel) => {
          try {
            console.log(`📊 Fetching data from ${channel}...`);
            const entity = await this.client.getEntity(channel);
            const messages = await this.client.getMessages(entity, { limit: 20 }); // Optimized: 50 → 20

            // Tam kanal bilgisini al
            let participantsCount = 0;
            try {
              const fullChannel = await this.client.invoke(
                new (await import('telegram/tl/functions/index.js')).channels.GetFullChannel({
                  channel: entity,
                })
              );
              participantsCount = fullChannel.fullChat.participantsCount || 0;
              console.log(`   👥 ${channel} has ${participantsCount} members`);
            } catch (fullChannelError) {
              console.log(`   ⚠️  Could not get member count for ${channel}`);
              participantsCount = entity.participantsCount || 0;
            }

            // Filter messages: Only from last 7 days
            const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
            const recentMessages = messages
              .filter(msg => msg.date >= sevenDaysAgo)
              .map(msg => ({
                id: msg.id,
                text: msg.message || '',
                date: msg.date,
                views: msg.views || 0,
              }));

            const channelInfo = {
              username: channel,
              title: entity.title || channel,
              participantsCount: participantsCount,
              recentMessages: recentMessages
            };

            console.log(`✅ Fetched ${recentMessages.length}/${messages.length} recent messages from ${channel} (last 7 days)`);
            return channelInfo;
          } catch (err) {
            console.error(`❌ Error fetching ${channel}:`, err.message);
            return null;
          }
        });

        const batchResults = await Promise.all(batchPromises);
        channelsData.push(...batchResults.filter(result => result !== null));

        // Batch'ler arası 1.5 saniye bekle (flood wait prevention)
        if (i + batchSize < cryptoChannels.length) {
          console.log('⏳ Waiting 1.5s before next batch...');
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      if (channelsData.length === 0) {
        throw new Error('No channels could be fetched from Telegram API');
      }

      console.log(`✅ Successfully fetched data from ${channelsData.length} channels`);
      return channelsData;
    } catch (error) {
      console.error('❌ Failed to fetch Telegram data:', error.message);
      throw error; // Hata fırlat - mock data kullanma
    }
  }

  async getTrendingCoins() {
    try {
      // Önce kanallardan verileri al
      const channels = await this.getTrendingChannels();
      
      // Popüler coinlerin listesi ve alternatifleri
      const coinPatterns = {
        'BTC': ['BTC', 'BITCOIN', '₿'],
        'ETH': ['ETH', 'ETHEREUM', 'Ξ'],
        'SOL': ['SOL', 'SOLANA'],
        'BNB': ['BNB', 'BINANCE'],
        'XRP': ['XRP', 'RIPPLE'],
        'ADA': ['ADA', 'CARDANO'],
        'DOGE': ['DOGE', 'DOGECOIN'],
        'MATIC': ['MATIC', 'POLYGON'],
        'DOT': ['DOT', 'POLKADOT'],
        'AVAX': ['AVAX', 'AVALANCHE'],
        'LINK': ['LINK', 'CHAINLINK'],
        'UNI': ['UNI', 'UNISWAP'],
        'ATOM': ['ATOM', 'COSMOS'],
        'TON': ['TON', 'TONCOIN'],
        'SHIB': ['SHIB', 'SHIBA'],
        'ARB': ['ARB', 'ARBITRUM'],
        'OP': ['OP', 'OPTIMISM'],
        'PEPE': ['PEPE'],
        'WIF': ['WIF', 'DOGWIFHAT'],
        'BONK': ['BONK']
      };

      // Sentiment keywords
      const positiveKeywords = [
        'BULLISH', 'BULL', 'MOON', 'PUMP', 'UP', 'HIGH', 'RISE', 'RISING', 'RALLY',
        'BREAKOUT', 'ATH', 'PROFIT', 'GAIN', 'WIN', 'STRONG', 'MOMENTUM', 'SURGE',
        '🚀', '📈', '💎', '🔥', '💪', '✅', '🟢', '⬆️', '📊', '💰', '🎯'
      ];

      const negativeKeywords = [
        'BEARISH', 'BEAR', 'DUMP', 'DOWN', 'CRASH', 'DROP', 'FALL', 'FALLING', 'DIP',
        'LOSS', 'SELL', 'WEAK', 'DECLINE', 'CORRECTION', 'LIQUIDATION', 'RIP', 'SCAM',
        '📉', '🔻', '⬇️', '🔴', '❌', '⚠️', '💔', '😢', '🩸'
      ];

      const coinData = {};
      
      // Her kanalın mesajlarını tara
      channels.forEach(channel => {
        if (channel.recentMessages) {
          channel.recentMessages.forEach(message => {
            const text = (message.text || '').toUpperCase();
            
            // Her coin için pattern kontrol et
            Object.entries(coinPatterns).forEach(([coin, patterns]) => {
              patterns.forEach(pattern => {
                // Kelime sınırlarıyla ara (tüm kelime eşleşmesi)
                const regex = new RegExp(`\\b${pattern}\\b`, 'g');
                const matches = text.match(regex);
                if (matches) {
                  // Initialize coin data if not exists
                  if (!coinData[coin]) {
                    coinData[coin] = {
                      mentions: 0,
                      positive: 0,
                      negative: 0,
                      neutral: 0
                    };
                  }
                  
                  coinData[coin].mentions += matches.length;
                  
                  // Sentiment analizi
                  let hasPositive = false;
                  let hasNegative = false;
                  
                  positiveKeywords.forEach(keyword => {
                    if (text.includes(keyword)) hasPositive = true;
                  });
                  
                  negativeKeywords.forEach(keyword => {
                    if (text.includes(keyword)) hasNegative = true;
                  });
                  
                  // Sentiment kategorize et
                  if (hasPositive && !hasNegative) {
                    coinData[coin].positive++;
                  } else if (hasNegative && !hasPositive) {
                    coinData[coin].negative++;
                  } else {
                    coinData[coin].neutral++;
                  }
                }
              });
            });
          });
        }
      });

      // En çok bahsedilen coinleri sırala ve sentiment ekle
      const trendingCoins = Object.entries(coinData)
        .map(([coin, data]) => {
          const total = data.mentions;
          const positivePercent = total > 0 ? Math.round((data.positive / total) * 100) : 0;
          const negativePercent = total > 0 ? Math.round((data.negative / total) * 100) : 0;
          const neutralPercent = 100 - positivePercent - negativePercent;
          
          return {
            symbol: coin,
            mentions: total,
            trend: total > 10 ? 'hot' : total > 5 ? 'rising' : 'normal',
            sentiment: {
              positive: positivePercent,
              negative: negativePercent,
              neutral: neutralPercent,
              score: positivePercent - negativePercent // -100 to +100
            }
          };
        })
        .sort((a, b) => b.mentions - a.mentions)
        .slice(0, 10); // Top 10

      console.log('🪙 Trending coins with sentiment:', trendingCoins);
      return trendingCoins;
    } catch (error) {
      console.error('Error getting trending coins:', error);
      throw error;
    }
  }

  async searchMessages(query, limit = 50) {
    try {
      if (!this.client || !this.client.connected) {
        await this.connect();
      }

      const results = [];
      const cryptoChannels = [
        '@whale_alert',
        '@CryptoQuant',
        '@santimentfeed',
      ];

      for (const channel of cryptoChannels) {
        try {
          const entity = await this.client.getEntity(channel);
          const messages = await this.client.getMessages(entity, {
            limit: limit,
            search: query,
          });

          messages.forEach(msg => {
            if (msg.message) {
              results.push({
                channel: channel,
                channelTitle: entity.title || channel,
                messageId: msg.id,
                text: msg.message,
                date: msg.date,
                views: msg.views || 0,
              });
            }
          });
        } catch (err) {
          console.error(`Error searching in ${channel}:`, err.message);
        }
      }

      return results.sort((a, b) => b.views - a.views);
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }

  async getChannelStats(channelUsername) {
    try {
      if (!this.client || !this.client.connected) {
        await this.connect();
      }

      const entity = await this.client.getEntity(channelUsername);
      const messages = await this.client.getMessages(entity, { limit: 100 });

      const totalViews = messages.reduce((sum, msg) => sum + (msg.views || 0), 0);
      const avgViews = messages.length > 0 ? totalViews / messages.length : 0;

      return {
        username: channelUsername,
        title: entity.title || channelUsername,
        participantsCount: entity.participantsCount || 0,
        totalMessages: messages.length,
        avgViews: Math.round(avgViews),
        recentActivity: messages.slice(0, 10).map(msg => ({
          id: msg.id,
          text: msg.message ? msg.message.substring(0, 100) + '...' : '',
          date: msg.date,
          views: msg.views || 0,
        }))
      };
    } catch (error) {
      console.error('Error getting channel stats:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.disconnect();
      console.log('Telegram client disconnected');
    }
  }
}

// Singleton instance
const telegramService = new TelegramService();

export default telegramService;

