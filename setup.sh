#!/bin/bash

# emtime Setup Script

echo "🚀 Setting up emtime..."
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your Google OAuth Client ID"
    echo "   VITE_GOOGLE_CLIENT_ID=your_client_id"
fi

echo ""
echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Google OAuth credentials"
echo "2. Run 'pnpm dev' to start the development server"
echo "3. Visit http://localhost:5173"
echo ""
echo "For detailed setup instructions, see README.md"
