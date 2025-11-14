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

// Load keywords database
const keywordsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/keywords.json'), 'utf8')
);

class TelegramService {
  constructor() {
    this.client = null;
    this.isConnecting = false; // Connection lock to prevent duplicate connections
    this.connectionPromise = null; // Store pending connection promise
    
    // CACHE SYSTEM: Prevent excessive API calls
    this.cache = {
      channels: {
        data: null,
        timestamp: null,
        ttl: 2 * 60 * 1000 // 2 minutes cache for real-time data
      },
      coins: {
        data: null,
        timestamp: null,
        ttl: 2 * 60 * 1000 // 2 minutes cache for real-time data
      },
      topics: {
        data: null,
        timestamp: null,
        ttl: 2 * 60 * 1000 // 2 minutes cache for real-time data
      }
    };
  }

  // CACHE HELPERS
  isCacheValid(cacheKey) {
    const cache = this.cache[cacheKey];
    if (!cache.data || !cache.timestamp) {
      return false;
    }
    const now = Date.now();
    const age = now - cache.timestamp;
    return age < cache.ttl;
  }

  setCache(cacheKey, data) {
    this.cache[cacheKey] = {
      ...this.cache[cacheKey],
      data: data,
      timestamp: Date.now()
    };
    console.log(`💾 Cache set for '${cacheKey}' (TTL: ${this.cache[cacheKey].ttl / 1000 / 60} minutes)`);
  }

  getCache(cacheKey) {
    if (this.isCacheValid(cacheKey)) {
      const age = Math.floor((Date.now() - this.cache[cacheKey].timestamp) / 1000);
      console.log(`✅ Cache HIT for '${cacheKey}' (age: ${age}s)`);
      return this.cache[cacheKey].data;
    }
    console.log(`❌ Cache MISS for '${cacheKey}' (expired or empty)`);
    return null;
  }

  async connect() {
    try {
      if (this.client && this.client.connected) {
        return this.client;
      }
      if (this.isConnecting && this.connectionPromise) {
        return await this.connectionPromise;
      }
      this.isConnecting = true;
      this.connectionPromise = (async () => {
        try {
          const sessionStr = process.env.TELEGRAM_SESSION || '';
          const apiIdRaw = process.env.TELEGRAM_API_ID;
          const apiHash = process.env.TELEGRAM_API_HASH;
          const apiId = apiIdRaw ? parseInt(apiIdRaw, 10) : NaN;
          if (!apiHash || Number.isNaN(apiId)) {
            throw new Error('Missing TELEGRAM_API_ID or TELEGRAM_API_HASH');
          }
          const session = new StringSession(sessionStr);
          this.client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });
          if (sessionStr && sessionStr.length > 0) {
            await this.client.connect();
          } else {
            throw new Error('TELEGRAM_SESSION is required in non-interactive environment');
          }
          return this.client;
        } catch (connectError) {
          // Handle AUTH_KEY_DUPLICATED error - try with empty session
          if (connectError.message && connectError.message.includes('AUTH_KEY_DUPLICATED')) {
            console.warn('⚠️  AUTH_KEY_DUPLICATED error - Session may be invalid or used elsewhere');
            console.log('💡 Tip: Generate a new session using: npm run telegram:auth');
            throw new Error('Telegram session is invalid. Please regenerate session using telegram:auth script.');
          }
          throw connectError;
        } finally {
          this.isConnecting = false;
          this.connectionPromise = null;
        }
      })();
      return await this.connectionPromise;
    } catch (error) {
      this.isConnecting = false;
      this.connectionPromise = null;
      throw error;
    }
  }

  async getTrendingChannels() {
    try {
      // CHECK CACHE FIRST
      const cachedData = this.getCache('channels');
      if (cachedData) {
        return cachedData;
      }

      // ALWAYS USE REAL TELEGRAM API
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
        '@glassnode',
        '@coindesk',
        '@cointelegraph',
        '@whale_alert',
        '@bitcoin',
        '@IntoTheBlock',
        '@Blockworks_',
        '@TheBlock__'
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

            console.log(`✅ Fetched ${recentMessages.length} messages from ${channel}`);
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
      
      // CACHE THE RESULT
      this.setCache('channels', channelsData);
      
      return channelsData;
    } catch (error) {
      console.error('❌ Failed to fetch Telegram data:', error.message);
      throw error; // Throw error instead of returning mock data
    }
  }

  async getTrendingCoins() {
    try {
      // CHECK CACHE FIRST
      const cachedCoins = this.getCache('coins');
      if (cachedCoins) {
        return cachedCoins;
      }

      // Önce kanallardan verileri al (bu da cache'den gelebilir)
      const channels = await this.getTrendingChannels();
      
      // Load known coins from JSON database (200+ coins)
      const knownCoins = {};
      coinsData.coins.forEach(coin => {
        knownCoins[coin.symbol] = coin.aliases;
      });

      // Blacklist from JSON
      const blacklist = new Set(coinsData.blacklist);

      // Sentiment keywords from JSON
      const positiveKeywords = [
        ...keywordsData.sentiment.positive.keywords,
        ...keywordsData.sentiment.positive.emojis
      ];

      const negativeKeywords = [
        ...keywordsData.sentiment.negative.keywords,
        ...keywordsData.sentiment.negative.emojis
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
      
      // CACHE THE RESULT
      this.setCache('coins', trendingCoins);
      
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

  async getTrendingTopics() {
    try {
      // CHECK CACHE FIRST
      const cachedTopics = this.getCache('topics');
      if (cachedTopics) {
        return cachedTopics;
      }

      // Get channel data (will use cache if available)
      const channels = await this.getTrendingChannels();

      // STOPWORDS: Load from JSON database (400+ words across all categories)
      const stopwords = new Set([
        ...keywordsData.stopwords.english_common,
        ...keywordsData.stopwords.crypto_general,
        ...keywordsData.stopwords.crypto_actions,
        ...keywordsData.stopwords.crypto_metrics,
        ...keywordsData.stopwords.crypto_content,
        ...keywordsData.stopwords.social_media,
        ...keywordsData.stopwords.web_tech,
        ...keywordsData.stopwords.time_references,
        ...keywordsData.stopwords.intensifiers,
        ...keywordsData.stopwords.modal_verbs,
        ...keywordsData.special_cases.ignore_as_topics
      ]);

      // Load blacklisted coin symbols (to exclude from topics)
      const coinBlacklist = new Set(coinsData.blacklist);
      
      // Get all known coin symbols (to exclude from general topics)
      const knownCoinSymbols = new Set(coinsData.coins.map(coin => coin.symbol));

      // Frequency map for words and phrases
      const wordFrequency = {};
      const phraseFrequency = {};

      // Analyze messages from all channels
      channels.forEach(channel => {
        if (channel.recentMessages && channel.recentMessages.length > 0) {
          channel.recentMessages.forEach(message => {
            const text = (message.text || '').toUpperCase();
            
            // Extract words (2-15 characters, letters only)
            const words = text.match(/\b[A-Z]{2,15}\b/g) || [];
            
            words.forEach(word => {
              // Skip if stopword, coin symbol, or blacklisted
              if (stopwords.has(word) || knownCoinSymbols.has(word) || coinBlacklist.has(word)) {
                return;
              }
              
              wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            });

            // Extract 2-word phrases (bigrams)
            for (let i = 0; i < words.length - 1; i++) {
              const word1 = words[i];
              const word2 = words[i + 1];
              
              // Skip if either word is stopword or coin
              if (stopwords.has(word1) || stopwords.has(word2) ||
                  knownCoinSymbols.has(word1) || knownCoinSymbols.has(word2) ||
                  coinBlacklist.has(word1) || coinBlacklist.has(word2)) {
                continue;
              }
              
              const phrase = `${word1} ${word2}`;
              phraseFrequency[phrase] = (phraseFrequency[phrase] || 0) + 1;
            }
          });
        }
      });

      // Sort and get top topics
      const topWords = Object.entries(wordFrequency)
        .filter(([_, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word, count]) => ({
          topic: word,
          type: 'keyword',
          mentions: count
        }));

      const topPhrases = Object.entries(phraseFrequency)
        .filter(([_, count]) => count >= 1)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([phrase, count]) => ({
          topic: phrase,
          type: 'phrase',
          mentions: count
        }));

      // Combine and sort by mentions
      const allTopics = [...topWords, ...topPhrases]
        .sort((a, b) => b.mentions - a.mentions)
        .slice(0, 10); // Top 10 overall

      console.log(`📌 Top trending topics:`, allTopics);

      // CACHE THE RESULT
      this.setCache('topics', allTopics);

      return allTopics;
    } catch (error) {
      console.error('Error getting trending topics:', error);
      throw error;
    }
  }

  // MOCK DATA for local development
  getMockChannelsData() {
    const now = Math.floor(Date.now() / 1000);
    const oneHourAgo = now - 3600;
    const twoHoursAgo = now - 7200;

    return [
      {
        username: '@bitcoin',
        title: 'Bitcoin News',
        participantsCount: 125000,
        recentMessages: [
          { id: 1, text: '$BTC is showing strong momentum! 🚀 Price breaking through resistance.', date: now - 300, views: 1500 },
          { id: 2, text: 'BULLISH: Bitcoin ETF inflows reaching new highs 📈', date: now - 1200, views: 2300 },
          { id: 3, text: '$ETH is following $BTC uptrend. Market sentiment is POSITIVE 💎', date: now - 2400, views: 1800 },
          { id: 4, text: 'BREAKING: Major institution announces $SOL purchase', date: oneHourAgo, views: 3200 },
          { id: 5, text: '$DOGE community excited about upcoming updates 🐕', date: twoHoursAgo, views: 980 }
        ],
        messageTimeRange: {
          oldest: new Date(twoHoursAgo * 1000).toISOString(),
          newest: new Date((now - 300) * 1000).toISOString()
        }
      },
      {
        username: '@coindesk',
        title: 'CoinDesk',
        participantsCount: 98000,
        recentMessages: [
          { id: 10, text: 'Analysis: $BTC dominance increasing as market consolidates', date: now - 500, views: 2100 },
          { id: 11, text: '$ETH gas fees dropping to yearly lows - BULLISH for adoption', date: now - 1500, views: 1650 },
          { id: 12, text: 'DeFi protocol reports MASSIVE $LINK integration', date: now - 2800, views: 1420 },
          { id: 13, text: 'BREAKING: $MATIC announces major partnership', date: oneHourAgo - 300, views: 2890 },
          { id: 14, text: 'Market update: $ADA showing strength despite bearish indicators', date: twoHoursAgo, views: 1230 }
        ],
        messageTimeRange: {
          oldest: new Date(twoHoursAgo * 1000).toISOString(),
          newest: new Date((now - 500) * 1000).toISOString()
        }
      },
      {
        username: '@cointelegraph',
        title: 'Cointelegraph',
        participantsCount: 112000,
        recentMessages: [
          { id: 20, text: 'URGENT: Whale transfers $50M in $BTC - bullish signal? 🐋', date: now - 600, views: 3400 },
          { id: 21, text: '$SOL network reaches new transaction record! MOON incoming? 🌙', date: now - 1800, views: 2560 },
          { id: 22, text: 'Crypto adoption: Major retailer accepts $BTC and $ETH', date: now - 3000, views: 1890 },
          { id: 23, text: '$XRP lawsuit update - POSITIVE developments for holders', date: oneHourAgo - 600, views: 4200 },
          { id: 24, text: 'BEARISH warning: Fed meeting could impact $BTC price', date: twoHoursAgo - 200, views: 2100 }
        ],
        messageTimeRange: {
          oldest: new Date((twoHoursAgo - 200) * 1000).toISOString(),
          newest: new Date((now - 600) * 1000).toISOString()
        }
      },
      {
        username: '@whale_alert',
        title: 'Whale Alert',
        participantsCount: 156000,
        recentMessages: [
          { id: 30, text: '🚨 1,250 $BTC transferred from unknown wallet to Binance', date: now - 400, views: 5600 },
          { id: 31, text: '🐋 MASSIVE $ETH movement detected: 45,000 ETH on the move!', date: now - 1400, views: 4800 },
          { id: 32, text: '⚠️ $USDT whale alert: $100M transferred', date: now - 2600, views: 3200 },
          { id: 33, text: '🚀 Bullish signal: Major $SOL accumulation by whales', date: oneHourAgo - 200, views: 3900 },
          { id: 34, text: '📊 $BNB whale activity increasing - watch closely!', date: twoHoursAgo - 400, views: 2850 }
        ],
        messageTimeRange: {
          oldest: new Date((twoHoursAgo - 400) * 1000).toISOString(),
          newest: new Date((now - 400) * 1000).toISOString()
        }
      }
    ];
  }

  clearCache(cacheKey = null) {
    if (cacheKey) {
      // Clear specific cache
      this.cache[cacheKey] = {
        ...this.cache[cacheKey],
        data: null,
        timestamp: null
      };
      console.log(`🗑️  Cache cleared for '${cacheKey}'`);
    } else {
      // Clear all caches
      Object.keys(this.cache).forEach(key => {
        this.cache[key] = {
          ...this.cache[key],
          data: null,
          timestamp: null
        };
      });
      console.log('🗑️  All caches cleared');
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

