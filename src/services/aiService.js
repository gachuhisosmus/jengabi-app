// src/services/aiService.js

class AIService {
  constructor() {
    this.baseURL = 'http://localhost:5000'; // Your Flask bot URL
  }

  async generateMarketingIdeas(products, platform, businessContext) {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products,
          platform,
          business_context: businessContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to mock data if API is unavailable
      return this.getFallbackIdeas(products, platform);
    }
  }

  async analyzeCustomerMessage(message, businessContext) {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          business_context: businessContext
        })
      });

      return await response.json();
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.getFallbackAnalysis(message);
    }
  }

  getFallbackIdeas(products, platform) {
    // Your existing mock data logic
    return {
      ideas: [
        {
          id: 1,
          content: `🌟 New ${products[0]} just dropped! ✨ Who's copping first? 👀\n\n#AfricanFashion #SupportLocal #MadeInAfrica`,
          platform: platform,
          type: 'post',
          engagement: 'high'
        }
      ]
    };
  }

  getFallbackAnalysis(message) {
    return {
      sentiment: 'neutral',
      insights: ['Message analysis temporarily unavailable'],
      recommendations: ['Please try again later']
    };
  }
}

export default new AIService();