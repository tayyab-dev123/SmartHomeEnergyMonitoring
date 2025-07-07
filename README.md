# Smart Home Energy Monitor with Conversational AI

A full-stack web application that monitors and analyzes home energy consumption with AI-powered conversational queries.

## Features

- **Device Management**: Monitor multiple smart home devices (AC, Refrigerator, Heater, Computer, Appliances)
- **Energy Tracking**: Real-time telemetry data collection and visualization
- **Interactive Charts**: Visual energy consumption patterns over time
- **AI Chat Assistant**: Natural language queries about energy usage
- **User Authentication**: Secure login/registration system
- **Dashboard**: Comprehensive energy monitoring interface

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API routes, NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-3.5-turbo for conversational queries
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Authentication**: NextAuth.js with credentials provider

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd energy-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/energy_monitor"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Database Setup**
   ```bash
   # Run Prisma migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   
   # (Optional) Seed the database with demo data
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Getting Started
1. Register a new account or use demo credentials
2. Login to access the dashboard
3. View your devices and their current energy consumption
4. Click on devices to see detailed energy charts
5. Use the AI assistant to ask questions about your energy usage

### AI Assistant Examples
- "How much energy did my AC use yesterday?"
- "What's my highest consuming device today?"
- "Show me my total usage last week"
- "Compare energy usage between my heater and AC"

## Database Schema

The application uses 4 main models:

- **User**: Authentication and user management
- **Device**: Smart home devices (AC, Refrigerator, etc.)
- **Telemetry**: Energy consumption readings
- **Query**: AI conversation history

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Devices
- `GET /api/devices` - Get user's devices
- `POST /api/devices` - Add new device

### Telemetry
- `GET /api/telemetry` - Get energy consumption data
- `POST /api/telemetry` - Submit new readings

### AI Chat
- `POST /api/chat/query` - Process natural language queries

## Deployment

### Vercel Deployment

1. **Push to GitHub/GitLab**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables for Production**
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-app.vercel.app"
   OPENAI_API_KEY="your-openai-api-key"
   ```

### Database Migration in Production
```bash
npx prisma migrate deploy
```

## Development Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# View database in Prisma Studio
npx prisma studio
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── page.js           # Home page
├── components/            # React components
│   ├── auth/             # Authentication forms
│   ├── dashboard/        # Dashboard components
│   └── providers/        # Context providers
├── lib/                  # Utility libraries
│   ├── prisma.js        # Prisma client
│   ├── auth.js          # NextAuth configuration
│   └── openai.js        # OpenAI client
└── middleware.js         # Next.js middleware

prisma/
├── schema.prisma         # Database schema
└── migrations/          # Database migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email tayyab.shahzad10@yahoo.com or create an issue in the repository.

---

**Note:**
Currently, the application uses static/demo data for device telemetry and energy usage. However, it is designed to be easily extendable and can be connected to real smart home devices or IoT data sources with minimal changes.
