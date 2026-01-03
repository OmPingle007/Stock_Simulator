import { GoogleGenAI, Type } from "@google/genai";
import { StockData, PortfolioConfig } from '../types';
import { PURCHASE_DATE, CURRENT_DATE } from '../constants';

export const fetchPortfolioData = async (config: PortfolioConfig): Promise<StockData[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the stock list part of the prompt
  const stockListDescription = config.stocks.map(s => {
    if (s.targetAmount) {
      return `${s.ticker} (Target Investment: ₹${s.targetAmount})`;
    }
    return s.ticker;
  }).join(', ');

  const prompt = `
    I need to simulate a realistic Indian stock portfolio for a dashboard.
    
    Scenario:
    - Total Capital Available: ₹${config.totalInvestment}
    - Purchase Date: ${PURCHASE_DATE}
    - Current Valuation Date: ${CURRENT_DATE}
    - Stocks: ${stockListDescription}

    Task:
    1. Distribute the capital among the stocks.
       - For stocks with a "Target Investment" specified, try to allocate close to that amount.
       - Distribute the remaining capital optimally among the other stocks (e.g., equal weight or market-cap weighted simulation).
    2. Estimate realistic stock prices (INR) for ${PURCHASE_DATE} (Purchase Price) and ${CURRENT_DATE} (Current Price).
    3. Calculate the "Shares Held" (shares).
       - CRITICAL: "Shares Held" MUST be a WHOLE NUMBER (Integer). You cannot buy fractional shares on NSE/BSE.
       - Calculate: floor(Allocated Amount / Purchase Price).
       - Adjust the allocated amount slightly to match (Shares * Purchase Price).
    4. Provide the "Previous Close" (price on the trading day before ${CURRENT_DATE}).

    Return the data as a JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ticker: { type: Type.STRING, description: "The stock ticker, e.g., NSE:RELIANCE" },
              name: { type: Type.STRING, description: "Company name" },
              shares: { type: Type.INTEGER, description: "Number of shares held (Must be an integer)" },
              avgCost: { type: Type.NUMBER, description: "Purchase price per share on purchase date" },
              currentPrice: { type: Type.NUMBER, description: "Price per share on current date" },
              previousClose: { type: Type.NUMBER, description: "Closing price on the previous trading day" }
            },
            required: ["ticker", "name", "shares", "avgCost", "currentPrice", "previousClose"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("No data returned from AI");
    }
    
    const data = JSON.parse(jsonText) as StockData[];
    return data;
  } catch (error) {
    console.error("Failed to fetch portfolio data:", error);
    throw error;
  }
};