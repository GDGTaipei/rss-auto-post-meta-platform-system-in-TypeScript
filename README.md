# RSS Auto Post Meta Platform System

A TypeScript-based automated social media posting system that fetches RSS feeds and uses Google Gemini AI to generate tailored content for Facebook, Instagram, and Threads platforms.

## Features

- 🤖 **AI-Powered Content Generation**: Uses Google Gemini to create platform-specific social media posts
- 📰 **RSS Feed Processing**: Automatically fetches and parses RSS feeds from various sources
- 🔄 **Multi-Platform Support**: Posts to Facebook, Instagram, and Threads
- 🏗️ **Clean Architecture**: Built with Domain-Driven Design principles
- ☁️ **Firebase Functions**: Serverless deployment on Google Cloud Platform
- 🧪 **Comprehensive Testing**: Full test coverage with Jest
- 🔧 **TypeScript**: Type-safe development with modern ES modules

## Architecture

The system follows clean architecture principles with clear separation of concerns:

```
src/
├── application/     # Express.js REST API endpoints
├── domain/          # Core business models and interfaces
├── usecase/         # Business logic orchestration
├── infrastructure/  # External service implementations
├── entities/        # Data transfer objects
└── config/          # Configuration management
```

### Key Components

- **SocialMediaPostFlow**: Main use case orchestrating the posting workflow
- **RssFeedService**: Handles RSS feed fetching and parsing
- **ContentGeneratorService**: Integrates with Google Gemini AI
- **SocialMediaService**: Manages posting to social platforms

## Tech Stack

- **Runtime**: Node.js 22
- **Language**: TypeScript with ES Modules
- **Framework**: Express.js
- **Cloud**: Firebase Functions
- **AI**: Google Gemini API
- **Testing**: Jest with TypeScript support
- **Parsing**: rss-parser, fast-xml-parser

## API Endpoints

### POST /post
Processes an RSS feed and posts content to configured social media platforms.

**Request:**
```json
{
  "rssUrl": "https://example.com/rss"
}
```

**Response:**
```json
{
  "platforms": [
    {
      "platform": "FACEBOOK",
      "success": true,
      "postId": "12345"
    },
    {
      "platform": "INSTAGRAM", 
      "success": true,
      "postId": "67890"
    },
    {
      "platform": "THREADS",
      "success": false,
      "error": "Authentication failed"
    }
  ]
}
```

## Environment Variables

Create a `.env` file in the functions directory:

```env
# Social Media API Configuration
SOCIAL_MEDIA_POST_API_URL=https://your-api-endpoint.com
FACEBOOK_PAGE_ID=your-facebook-page-id
FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-token
INSTAGRAM_PAGE_ID=your-instagram-page-id  
INSTAGRAM_PAGE_ACCESS_TOKEN=your-instagram-token
THREADS_USER_ID=your-threads-user-id

# Firebase Configuration
CONFIG_JSON={"your":"firebase-config"}

# API Limits
MAX_RETRIES=3
TIMEOUT_SECONDS=60
```

## Getting Started

### Prerequisites
- Node.js 22 or higher
- npm or yarn package manager
- Firebase CLI
- Google Cloud Project with Gemini API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd rss-auto-post-meta-platform-system-in-TypeScript
   ```

2. **Install dependencies**
   ```bash
   cd functions
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

### Development

1. **Start local emulator**
   ```bash
   npm run serve
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Run tests with coverage**
   ```bash
   npm run test-coverage
   ```

### Deployment

1. **Deploy to Firebase**
   ```bash
   npm run deploy
   ```

2. **Set up GitHub Actions** (optional)
   - Configure secrets in GitHub repository settings
   - Push to main branch triggers automatic deployment

## Usage Examples

### Basic RSS Processing
```bash
curl -X POST https://your-function-url.cloudfunctions.net/post \
  -H "Content-Type: application/json" \
  -d '{"rssUrl": "https://feeds.feedburner.com/TechCrunch"}'
```

### Testing Locally
```bash
# Start emulator
npm run serve

# Test endpoint
curl -X POST http://localhost:5001/your-project/us-central1/app/post \
  -H "Content-Type: application/json" \
  -d '{"rssUrl": "https://example.com/feed.xml"}'
```

## Testing

The project includes comprehensive tests covering:

- Unit tests for all services and use cases
- Integration tests for the Express application
- Mock implementations for external dependencies
- Configuration validation tests

Run tests with:
```bash
npm test              # Run all tests
npm run test-coverage # Run with coverage report
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Hank Yu** - [GitHub Profile](https://github.com/your-username)

## Support

For support and questions, please open an issue in the GitHub repository.