"use client";

import React, { useState, useEffect, useRef } from "react";
import { Maximize2, Send, Bot, User, TrendingUp, Shield, Leaf } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Generate a static ID for the chat to ensure it doesn't get recreated
const CHAT_ID = `esg-chat-${Math.random().toString(36).substring(2, 9)}`;

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  metadata?: {
    esgScore?: number;
    carbonIntensity?: number;
    complianceStatus?: string;
    recommendations?: string[];
  };
}

const ESG_SAMPLE_RESPONSES = [
  {
    trigger: ["data quality", "pcaf", "data", "quality"],
    response: "Data Quality Assessment Summary: The proportion of primary data sources (high quality, high provenance obtained from asset owners and operators) is lower compared to the existing L&G portfolio. The overall PCAF data quality score is 2.6 vs 2.3 for the existing L&G portfolio, representing a +0.2 deterioration. Primary data usage is 60% (vs 85% for existing portfolio), secondary data is 25% (vs 20%), and estimated data is 15% (vs 5%). The root cause is the greater proportion of real estate equity and infrastructure assets in the portfolio under assessment, which inherently have lower data availability and quality compared to traditional bond investments.",
    metadata: {
      esgScore: 78.4,
      carbonIntensity: 142.3,
      complianceStatus: "PCAF Score: 2.6",
      recommendations: [
        "Enhanced data collection for real estate and infrastructure assets",
        "Implement stronger validation processes for secondary data sources",
        "Develop more sophisticated estimation models for limited data assets",
        "Establish regular data quality reviews and improvement processes"
      ]
    }
  },
  {
    trigger: ["portfolio", "esg", "score"],
    response: "Your portfolio has an ESG score of 78.4/100, placing it in the top quartile globally. The Environmental pillar scores 82.1, Social 76.8, and Governance 76.3. This represents a 12% improvement over the past year.",
    metadata: {
      esgScore: 78.4,
      carbonIntensity: 142.3,
      complianceStatus: "Compliant",
      recommendations: [
        "Consider increasing allocation to renewable energy companies",
        "Reduce exposure to high-carbon intensity sectors",
        "Enhance governance screening criteria"
      ]
    }
  },
  {
    trigger: ["climate", "carbon", "emissions"],
    response: "Portfolio carbon intensity is 142.3 tCO2e/$M invested, 35% below the MSCI ACWI benchmark. Scope 3 emissions represent 78% of total footprint. Climate VaR at 95% confidence is -2.8% under a disorderly transition scenario.",
    metadata: {
      esgScore: 78.4,
      carbonIntensity: 142.3,
      complianceStatus: "Compliant",
      recommendations: [
        "Implement net-zero transition plan by 2030",
        "Increase climate solutions allocation to 15%",
        "Engage with high-emission holdings on decarbonization"
      ]
    }
  },
  {
    trigger: ["regulation", "compliance", "sfdr"],
    response: "Portfolio is 96.7% compliant with EU SFDR Article 8 requirements. 23 holdings require additional sustainability data. TCFD disclosure readiness is at 89%. SEC Climate Rule preparation is on track for Q1 2025 implementation.",
    metadata: {
      esgScore: 78.4,
      carbonIntensity: 142.3,
      complianceStatus: "96.7% Compliant",
      recommendations: [
        "Complete sustainability data collection for 23 holdings",
        "Enhance TCFD scenario analysis documentation",
        "Prepare SEC Climate Rule disclosure framework"
      ]
    }
  },
  {
    trigger: ["performance", "returns", "attribution"],
    response: "ESG integration has contributed +0.47% annualized alpha over 3 years. Environmental factors contributed +0.23%, Social +0.18%, Governance +0.06%. ESG momentum factor shows strongest performance with +1.2% YTD.",
    metadata: {
      esgScore: 78.4,
      carbonIntensity: 142.3,
      complianceStatus: "Compliant",
      recommendations: [
        "Maintain ESG momentum factor allocation",
        "Consider increasing environmental factor exposure",
        "Review governance screening methodology"
      ]
    }
  },
  {
    trigger: ["risk", "controversy", "monitoring"],
    response: "Current ESG risk monitoring shows 2 severe controversies affecting 0.8% of portfolio weight. Real-time sentiment analysis indicates improving ESG perception across 67% of holdings. Regulatory risk score is low at 2.1/10.",
    metadata: {
      esgScore: 78.4,
      carbonIntensity: 142.3,
      complianceStatus: "Low Risk",
      recommendations: [
        "Engage with companies involved in severe controversies",
        "Implement enhanced monitoring for reputational risks",
        "Consider exclusion criteria for persistent ESG violations"
      ]
    }
  }
];

export function ESGChatProvider() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("ESGChatProvider mounted for ESG portfolio analysis");
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: `welcome-${Date.now()}`,
      content: "Welcome to ESG Portfolio Analytics! I can help you analyze your portfolio's ESG performance, climate risks, regulatory compliance, and investment opportunities. What would you like to explore?",
      sender: "assistant",
      timestamp: new Date(),
      metadata: {
        esgScore: 78.4,
        carbonIntensity: 142.3,
        complianceStatus: "Compliant",
        recommendations: [
          "Ask about portfolio ESG scores and performance",
          "Explore climate risk and carbon footprint analysis",
          "Review data quality assessment and PCAF scores",
          "Review regulatory compliance status",
          "Get ESG investment recommendations"
        ]
      }
    };
    
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find matching response based on keywords
    const matchingResponse = ESG_SAMPLE_RESPONSES.find(response =>
      response.trigger.some(keyword =>
        inputValue.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const responseContent = matchingResponse?.response || 
      "I can help you analyze various aspects of your ESG portfolio including performance metrics, climate risks, regulatory compliance, and investment opportunities. Could you be more specific about what you'd like to explore?";

    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      content: responseContent,
      sender: "assistant",
      timestamp: new Date(),
      metadata: matchingResponse?.metadata || {
        esgScore: 78.4,
        carbonIntensity: 142.3,
        complianceStatus: "Compliant",
        recommendations: [
          "Try asking about ESG scores, climate risks, or compliance status",
          "Explore portfolio optimization opportunities",
          "Review regulatory requirements and deadlines"
        ]
      }
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageComponent = ({ message }: { message: Message }) => (
    <div className={`flex gap-3 mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
      {message.sender === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-4 h-4 text-green-600" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : ""}`}>
        <div className={`p-3 rounded-lg ${
          message.sender === "user" 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-900"
        }`}>
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {message.metadata && message.sender === "assistant" && (
          <Card className="mt-3 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs font-medium text-gray-600">ESG Score</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {message.metadata.esgScore}/100
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Leaf className="w-4 h-4 text-blue-600 mr-1" />
                    <span className="text-xs font-medium text-gray-600">Carbon Intensity</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {message.metadata.carbonIntensity} tCO2e/$M
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Shield className="w-4 h-4 text-purple-600 mr-1" />
                    <span className="text-xs font-medium text-gray-600">Compliance</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {message.metadata.complianceStatus}
                  </Badge>
                </div>
              </div>
              
              {message.metadata.recommendations && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {message.metadata.recommendations.slice(0, 3).map((rec, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {message.sender === "user" && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1 order-3">
          <User className="w-4 h-4 text-blue-600" />
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-100 p-2 flex justify-between items-center border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">
          ESG Portfolio Analytics - AI Assistant
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            console.log("Expand ESG chat button clicked");
            setIsDialogOpen(true);
          }}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          title="View in fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
          <span className="sr-only">Expand chat</span>
        </Button>
      </div>

      <div className="h-[450px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-green-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about ESG scores, climate risks, compliance..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Full-screen dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
        }}
      >
        <DialogContent className="p-0 m-0 max-w-[99vw] w-[99vw] max-h-[99vh] h-[99vh] overflow-auto border-0 rounded-none">
          <DialogTitle className="sr-only">
            ESG Portfolio Analytics - AI Assistant
          </DialogTitle>
          <div className="h-full w-full flex flex-col">
            <div className="bg-white py-1 px-3 border-b flex justify-between items-center shrink-0 shadow-sm z-10">
              <h2 className="text-lg font-semibold">
                ESG Portfolio Analytics - AI Assistant
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <MessageComponent key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="border-t p-6">
                <div className="flex gap-2 max-w-4xl mx-auto">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about ESG scores, climate risks, compliance..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
