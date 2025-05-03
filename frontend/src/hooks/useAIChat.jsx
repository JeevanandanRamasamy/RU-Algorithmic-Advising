import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * Custom hook to manage AI chat interactions.
 * Handles sending and receiving messages, storing chat history, and user info management.
 */
const useAIChat = () => {
	const { token } = useAuth();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);

	// Load messages from sessionStorage if available
	useEffect(() => {
		const storedMessages = sessionStorage.getItem("chatMessages");
		if (storedMessages) {
			setMessages(JSON.parse(storedMessages)); // Parse the stored JSON and set the messages
		}
	}, []);

	// Save messages to sessionStorage whenever it changes
	useEffect(() => {
		if (messages.length > 0) {
			const usefulMessages = [];
			for (let i = 0; i < messages.length; i++) {
				const msg = messages[i];

				// If this is a user message, check what AI replied
				if (msg.sender === "user") {
					const nextMsg = messages[i + 1];
					if (
						nextMsg &&
						nextMsg.sender === "ai" &&
						nextMsg.text &&
						nextMsg.text.toLowerCase().includes("something went wrong")
					) {
						// Skip both user and assistant error messages
						i++;
						continue;
					} else if (nextMsg && nextMsg.sender === "user") {
						continue;
					} else {
						usefulMessages.push(msg);
					}
				} else {
					usefulMessages.push(msg);
				}
			}
			sessionStorage.setItem("chatMessages", JSON.stringify(usefulMessages));
		}
	}, [messages]);

	// Function to send a message to the AI and get a response
	const sendMessage = async () => {
		if (!input.trim()) return;

		// Add user message to the chat
		const userMessage = { text: input, sender: "user" };
		setMessages(prev => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		try {
			// Make POST request to the backend API
			const response = await fetch(`${backendUrl}/api/AI_chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ message: input })
			});

			if (!response.ok) throw new Error("Failed to fetch AI response");

			const data = await response.json();
			const aiMessage = { text: data.response, sender: "ai" };

			// Add AI response to the chat
			setMessages(prev => [...prev, aiMessage]);
		} catch (error) {
			// Handle errors and send a fallback message
			const errorMessage = { text: "Sorry, something went wrong.", sender: "ai" };
			setMessages(prev => [...prev, errorMessage]);
			console.error("Error fetching AI response:", error);
		} finally {
			setLoading(false);
		}
	};

	// Function to call the backend API for setting user info
	const setUserInfo = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/AI_chat/set_user_info`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});

			if (!response.ok) {
				throw new Error("Failed to set user info");
			}

			// Optionally, handle the response or success state (e.g., log or show a success message)
		} catch (error) {
			console.error("Error setting user info:", error);
		}
	};

	return {
		messages,
		setMessages,
		input,
		setInput,
		sendMessage,
		loading,
		setUserInfo
	};
};

export default useAIChat;
