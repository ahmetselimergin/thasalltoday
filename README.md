# ThatsAllToday 🚀

A modern web3 application showcasing crypto community sentiment through animated tweet streams.

## ✨ Features

- 🔗 **Wallet Integration** - Connect with MetaMask or compatible wallets
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🎨 **Modern UI/UX** - Glassmorphism effects and smooth animations
- 🎭 **Animated Tweet Streams** - 3 scrolling tweet strips with crypto content
- ⚡ **Built with React + TypeScript** - Type-safe, modern development

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** SCSS, Bootstrap
- **Web3:** ethers.js, MetaMask integration
- **Animation:** CSS animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd thasalltoday
```

2. Install dependencies:
```bash
cd frontend/thatsalltoday
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser:
```
http://localhost:5173
```

## 📁 Project Structure

```
thasalltoday/
├── frontend/
│   └── thatsalltoday/
│       ├── src/
│       │   ├── components/
│       │   │   ├── navigation/      # Navigation bar with wallet connect
│       │   │   ├── heroSection/     # Hero landing section
│       │   │   └── tweetHero/       # Animated tweet streams
│       │   ├── context/
│       │   │   └── WalletContext.tsx # Web3 wallet management
│       │   ├── types/
│       │   │   └── ethereum.d.ts    # TypeScript declarations
│       │   └── assets/              # Images and static files
│       └── package.json
└── README.md
```

## 🎯 Key Components

### TweetHero Component

The main attraction - displays crypto community tweets in three animated scrolling strips:

- **Strip 1:** Bitcoin & General Crypto (scrolls left to right →)
- **Strip 2:** Ethereum & DeFi (scrolls right to left ←)
- **Strip 3:** Web3, NFTs & Metaverse (scrolls left to right →)

Features:
- Infinite scroll animation
- Pause on hover
- Like & retweet counts
- Responsive design

### Wallet Context

Manages Web3 wallet connections:
- Connect/disconnect wallet
- Account management
- Network detection
- Balance tracking

### Navigation

Sticky navigation bar with:
- Brand logo
- Wallet connection button
- Address display when connected

## 🎨 Customization

### Adding More Tweets

Edit `src/components/tweetHero/main.tsx`:

```typescript
const tweets1: Tweet[] = [
  { 
    id: 1, 
    username: 'YourName', 
    handle: '@yourhandle', 
    content: 'Your tweet content here!', 
    avatar: '🚀',
    likes: 1234,
    retweets: 567 
  },
  // Add more tweets...
];
```

### Changing Animation Speed

Edit `src/components/tweetHero/style.scss`:

```scss
&.scroll-left {
  animation: scrollLeft 30s linear infinite; // Change duration
}
```

### Styling

All styles are in SCSS files:
- `App.scss` - Global styles
- `index.scss` - Base styles
- Component-specific `style.scss` files

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Production build

# Preview
npm run preview      # Preview production build

# Lint
npm run lint         # Run ESLint
```

## 🌐 Web3 Features

### Wallet Connection

The app supports:
- MetaMask
- Any injected Ethereum provider
- Network switching
- Account change detection

### Requirements

- Modern browser with Web3 wallet extension
- Ethereum-compatible wallet (MetaMask recommended)

## 📱 Responsive Design

Fully responsive breakpoints:
- Desktop: Full experience
- Tablet: Optimized layout
- Mobile: Touch-friendly interface

## 🎭 Design Features

- **Glassmorphism** - Modern frosted glass effects
- **Gradient Text** - Eye-catching color gradients
- **Smooth Animations** - Buttery smooth 60fps animations
- **Dark Theme** - Easy on the eyes

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop 'dist' folder to Netlify
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Inspired by modern crypto Twitter
- Built with love for the Web3 community
- Powered by React and Web3 technologies

---

**Happy Building! 🚀**

For questions or support, please open an issue.
