// server/check-env.js
import dotenv from 'dotenv';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

console.log('🔍 Checking environment configuration...\n');

// Check OpenAI API Key
if (process.env.OPENAI_API_KEY) {
  console.log('✅ OpenAI API Key is set');
  console.log(`   Key starts with: ${process.env.OPENAI_API_KEY.substring(0, 7)}...`);
} else {
  console.log('❌ OpenAI API Key is NOT set');
  console.log('   Please add OPENAI_API_KEY to your .env file');
}

// Check Tavily API Key
if (process.env.TAVILY_API_KEY) {
  console.log('✅ Tavily API Key is set');
  console.log(`   Key starts with: ${process.env.TAVILY_API_KEY.substring(0, 7)}...`);
} else {
  console.log('❌ Tavily API Key is NOT set');
  console.log('   Please add TAVILY_API_KEY to your .env file');
}

// Check Port
console.log(`\n📡 Server Port: ${process.env.PORT || 3001}`);

// Test API connections
console.log('\n🧪 Testing API connections...');

async function testConnections() {
  if (process.env.OPENAI_API_KEY) {
    try {
      // Test OpenAI
      const model = new ChatOpenAI({
        model: "gpt-4o-mini",
        temperature: 0,
      });
      await model.invoke("Hello");
      console.log('✅ OpenAI connection successful');
    } catch (error) {
      console.log('❌ OpenAI connection failed:', error.message);
    }
  }

  if (process.env.TAVILY_API_KEY) {
    try {
      // Test Tavily
      const tavily = new TavilySearchResults({ maxResults: 1 });
      await tavily.invoke("test");
      console.log('✅ Tavily connection successful');
    } catch (error) {
      console.log('❌ Tavily connection failed:', error.message);
    }
  }
}

testConnections().then(() => {
  console.log('\n✨ Environment check complete!');
  console.log('\nNext steps:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Add your API keys to the .env file');
  console.log('3. Run "npm run dev" to start the server');
  process.exit(0);
}).catch((error) => {
  console.error('\n❌ Environment check failed:', error.message);
  process.exit(1);
});