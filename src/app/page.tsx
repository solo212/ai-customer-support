"use client";

// Define SpeechRecognition and related types manually
interface SpeechRecognition {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Extend the global window object
declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognition | undefined;
  }
}

import React, { useState, useEffect } from "react";
import Sentiment from "sentiment";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../firebase";

// Import the Sign-Out Button
import LogOutButton from "../components/LogOutButton";

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { text: "Welcome! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [sentimentScore, setSentimentScore] = useState<number | null>(null);
  const router = useRouter();
  const sentiment = new Sentiment();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth"); // Redirect to sign-in page if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };

    const result = sentiment.analyze(input);
    setSentimentScore(result.score);

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse =
        result.score > 0
          ? "I'm glad to hear that! How else can I help you?"
          : result.score < 0
          ? "I'm sorry to hear that. Can you provide more details?"
          : "Thank you for sharing. What else can I assist with?";

      setMessages((prev) => [
        ...prev,
        { text: botResponse, sender: "bot" },
      ]);

      speak(botResponse);
    }, 1000);

    setInput("");
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech is not supported in this browser.");
    }
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window && window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const spokenText = event.results[0][0].transcript;
        setInput(spokenText);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
      };

      recognition.start();
    } else {
      console.error("Speech Recognition is not supported in this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white py-4 px-6 rounded-t-lg flex justify-between items-center">
          <h1 className="text-xl font-semibold">AI Customer Support</h1>
          <LogOutButton /> {/* Add the Sign-Out Button */}
        </div>
        <div className="p-6 h-96 overflow-y-auto flex flex-col space-y-4" style={{ scrollBehavior: "smooth" }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                } px-4 py-2 rounded-lg max-w-xs`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        {sentimentScore !== null && (
          <div className="p-4 text-center">
            <p>
              Sentiment Score:{" "}
              <span
                className={`${
                  sentimentScore > 0
                    ? "text-green-500"
                    : sentimentScore < 0
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {sentimentScore}
              </span>
            </p>
          </div>
        )}
        <div className="flex items-center p-4 border-t border-gray-200">
          <button
            onClick={handleVoiceInput}
            className="mr-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Speak
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;