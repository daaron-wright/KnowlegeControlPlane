import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  isUser?: boolean
  content: ReactNode | string
}

export function ChatMessage({ isUser = false, content }: ChatMessageProps) {
  return (
    <div className={`mb-6 ${isUser ? "pl-8" : "pr-8"}`}>
      {/* Message header */}
      <div className={`flex items-center gap-2 mb-2 ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-medium">
            O
          </div>
        )}
        <div className="text-sm font-medium text-gray-700">{isUser ? "You" : "Omnis AI"}</div>
        {isUser && (
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-medium">
            U
          </div>
        )}
      </div>

      {/* Message content */}
      <div className={`text-gray-700 prose prose-sm max-w-none ${isUser ? "text-right" : "text-left"}`}>
        {typeof content === "string" ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        ) : (
          content
        )}
      </div>
    </div>
  )
}

