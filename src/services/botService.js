// === START CREATE: src/services/botService.js ===
// Create this new file in src/services/

class BotService {
  constructor() {
    this.baseURL = import.meta.env.VITE_BOT_API_URL  // Your Flask bot URL
  }

  async generateMarketingIdeas(products, platform, businessContext, outputType = 'ideas') {
    try {
      const response = await fetch(`${this.baseURL}/api/generate-ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          products,
          platform,
          business_context: businessContext,
          output_type: outputType
        })
      })
      
      if (!response.ok) {
        throw new Error(`Bot API responded with status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Bot Service Error:', error)
      throw error
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
      })
      
      if (!response.ok) throw new Error('Analysis failed')
      return await response.json()
    } catch (error) {
      console.error('Analysis Service Error:', error)
      throw error
    }
  }

  async getBusinessAdvice(question, businessContext) {
    try {
      const response = await fetch(`${this.baseURL}/api/business-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          business_context: businessContext
        })
      })
      
      if (!response.ok) throw new Error('Advice service failed')
      return await response.json()
    } catch (error) {
      console.error('Advice Service Error:', error)
      throw error
    }
  }

  // Health check to verify bot connection
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/`)
      return response.ok
    } catch (error) {
      return false
    }
  }
}

export default new BotService()
// === END CREATE: src/services/botService.js ===