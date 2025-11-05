import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import input from 'input';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load coins database
const coinsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/coins.json'), 'utf8')
);

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
            
            // ADAPTIVE MESSAGE FETCHING: Fetch more messages to ensure we get recent ones
            // Aktif kanallar için 50 mesaj yeterli, pasif kanallar için daha fazla gerekebilir
            const initialLimit = 100; // Increased from 20 to 100 for better time coverage
            const messages = await this.client.getMessages(entity, { limit: initialLimit });

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

            // TIME-BASED FILTERING: Only from last 48 hours (more relevant for trends)
            // 48 saat = 2 gün, güncel trendler için daha doğru
            const fortyEightHoursAgo = Math.floor(Date.now() / 1000) - (48 * 60 * 60);
            
            let recentMessages = messages
              .filter(msg => msg.date >= fortyEightHoursAgo)
              .map(msg => ({
                id: msg.id,
                text: msg.message || '',
                date: msg.date,
                views: msg.views || 0,
              }));

            // NORMALIZE: Limit to max 20 messages per channel for fair weight distribution
            // Her kanaldan maksimum 20 mesaj al, böylece aktif kanallar dominant olmaz
            if (recentMessages.length > 20) {
              // En yeni 20 mesajı al
              recentMessages = recentMessages.slice(0, 20);
            }

            const channelInfo = {
              username: channel,
              title: entity.title || channel,
              participantsCount: participantsCount,
              recentMessages: recentMessages,
              messageTimeRange: recentMessages.length > 0 ? {
                oldest: new Date(recentMessages[recentMessages.length - 1].date * 1000).toISOString(),
                newest: new Date(recentMessages[0].date * 1000).toISOString(),
              } : null
            };

            console.log(`✅ Fetched ${recentMessages.length} messages from ${channel} (last 48h from ${initialLimit} checked)`);
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
      
      // Load known coins from JSON database (200+ coins)
      const knownCoins = {};
      coinsData.coins.forEach(coin => {
        knownCoins[coin.symbol] = coin.aliases;
      });

      // Blacklist from JSON
      const blacklist = new Set(coinsData.blacklist);

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
      const channelCoinData = {}; // Per-channel coin tracking for normalization
      
      // Her kanalın mesajlarını tara
      channels.forEach(channel => {
        if (channel.recentMessages && channel.recentMessages.length > 0) {
          // Initialize per-channel data
          const channelCoins = {};
          
          channel.recentMessages.forEach(message => {
            const text = (message.text || '').toUpperCase();
            const originalText = message.text || '';
            
            // DYNAMIC DETECTION - Method 1: Find $SYMBOL patterns
            const dollarSignPattern = /\$([A-Z]{2,6})\b/g;
            let match;
            while ((match = dollarSignPattern.exec(originalText)) !== null) {
              const symbol = match[1].toUpperCase();
              if (!blacklist.has(symbol)) {
                this.addCoinMention(channelCoins, symbol, text, positiveKeywords, negativeKeywords);
              }
            }
            
            // DYNAMIC DETECTION - Method 2: Find uppercase 2-6 letter words
            const upperCasePattern = /\b([A-Z]{2,6})\b/g;
            while ((match = upperCasePattern.exec(originalText)) !== null) {
              const symbol = match[1];
              // Skip if blacklisted or if it's a sentiment keyword
              if (!blacklist.has(symbol) && 
                  !positiveKeywords.includes(symbol) && 
                  !negativeKeywords.includes(symbol)) {
                this.addCoinMention(channelCoins, symbol, text, positiveKeywords, negativeKeywords);
              }
            }
            
            // KNOWN COINS - Check against known coin names
            Object.entries(knownCoins).forEach(([symbol, aliases]) => {
              // Check main symbol
              const symbolRegex = new RegExp(`\\b${symbol}\\b`, 'g');
              if (symbolRegex.test(text)) {
                this.addCoinMention(channelCoins, symbol, text, positiveKeywords, negativeKeywords);
              }
              
              // Check aliases
              aliases.forEach(alias => {
                const aliasRegex = new RegExp(`\\b${alias}\\b`, 'gi');
                if (aliasRegex.test(text)) {
                  this.addCoinMention(channelCoins, symbol, text, positiveKeywords, negativeKeywords);
                }
              });
            });
          });
          
          // CHANNEL NORMALIZATION: Add this channel's coins to global with equal weight
          // Her kanal eşit ağırlıkta, aktif kanallar dominant olmaz
          Object.entries(channelCoins).forEach(([symbol, data]) => {
            if (!coinData[symbol]) {
              coinData[symbol] = {
                mentions: 0,
                positive: 0,
                negative: 0,
                neutral: 0,
                channelCount: 0 // Kaç kanal bu coin'den bahsetti
              };
            }
            
            // Normalize by channel: Add weighted data
            // Her kanaldan maksimum katkı sınırlı (örn: 1 channel = 1 vote weight)
            coinData[symbol].mentions += Math.min(data.mentions, 5); // Max 5 mention per channel
            coinData[symbol].positive += data.positive;
            coinData[symbol].negative += data.negative;
            coinData[symbol].neutral += data.neutral;
            coinData[symbol].channelCount++;
          });
        }
      });

      // Filter out coins with less than 2 mentions or mentioned in less than 2 channels
      // Bu sayede sadece 1 kanalda çok bahsedilen coinler filtreleniyor
      const filteredCoinData = Object.entries(coinData)
        .filter(([_, data]) => data.mentions >= 2 && data.channelCount >= 2);

      // En çok bahsedilen coinleri sırala ve sentiment ekle
      const trendingCoins = filteredCoinData
        .map(([coin, data]) => {
          const total = data.mentions;
          const positivePercent = total > 0 ? Math.round((data.positive / total) * 100) : 0;
          const negativePercent = total > 0 ? Math.round((data.negative / total) * 100) : 0;
          const neutralPercent = 100 - positivePercent - negativePercent;
          
          // Trend score: mentions + channel diversity bonus
          // Daha fazla kanalda bahsedilen coinler daha önemli
          const trendScore = data.mentions + (data.channelCount * 2);
          
          return {
            symbol: coin,
            mentions: total,
            channelCount: data.channelCount,
            trend: trendScore > 15 ? 'hot' : trendScore > 8 ? 'rising' : 'normal',
            sentiment: {
              positive: positivePercent,
              negative: negativePercent,
              neutral: neutralPercent,
              score: positivePercent - negativePercent // -100 to +100
            }
          };
        })
        .sort((a, b) => {
          // Primary sort: channel diversity (daha fazla kanal = daha güvenilir trend)
          if (b.channelCount !== a.channelCount) {
            return b.channelCount - a.channelCount;
          }
          // Secondary sort: mentions
          return b.mentions - a.mentions;
        })
        .slice(0, 15); // Top 15 (increased from 10)

      console.log(`🪙 Trending coins with sentiment (DYNAMIC DETECTION - ${coinsData.coins.length} coins in database):`, trendingCoins);
      return trendingCoins;
    } catch (error) {
      console.error('Error getting trending coins:', error);
      throw error;
    }
  }

  // Helper method to add coin mention and analyze sentiment
  addCoinMention(coinData, symbol, text, positiveKeywords, negativeKeywords) {
    // Initialize coin data if not exists
    if (!coinData[symbol]) {
      coinData[symbol] = {
        mentions: 0,
        positive: 0,
        negative: 0,
        neutral: 0
      };
    }
    
    coinData[symbol].mentions++;
    
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
      coinData[symbol].positive++;
    } else if (hasNegative && !hasPositive) {
      coinData[symbol].negative++;
    } else {
      coinData[symbol].neutral++;
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

