import React from "react";

interface MarkdownRendererProps {
  content: string;
  theme: "dark" | "light";
}

/**
 * A fast, secure, and beautiful lightweight Markdown renderer custom-made
 * for Sorside. It parses standard markdown formats:
 * - Headings: ### H3, ## H2, # H1
 * - Blockquotes: > quote text
 * - Bold: **text**
 * - Italic: *text* or _text_
 * - Bullet lists: - item or * item
 * - Line breaks & Paragraph breaks
 */
export default function MarkdownRenderer({ content, theme }: MarkdownRendererProps) {
  if (!content) return null;

  // Process line by line
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  
  let keyIndex = 0;
  let inList = false;
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${keyIndex++}`} className="list-disc pl-6 my-4 space-y-2">
          {listItems.map((item, idx) => (
            <li 
              key={`li-${idx}`} 
              className={theme === "dark" ? "text-zinc-300" : "text-stone-700"}
            >
              {renderInlineStyles(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  // Helper to parse bold and italic inline styles
  function renderInlineStyles(text: string): React.ReactNode[] {
    // Basic bold **text** and italic *text* parsing
    // Split by ** first to extract bold sections
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, index) => {
      // Even indexes are plain (or potentially italic), odd indexes are bold
      if (index % 2 === 1) {
        return (
          <strong key={index} className={theme === "dark" ? "text-white font-semibold" : "text-stone-950 font-semibold"}>
            {renderItalics(part)}
          </strong>
        );
      } else {
        return <span key={index}>{renderItalics(part)}</span>;
      }
    });
  }

  function renderItalics(text: string): React.ReactNode[] {
    const parts = text.split(/\*([^*]+)\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="font-serif">
            {part}
          </span>
        );
      } else {
        // Also handle underscores for italics: _text_
        const subParts = part.split(/_([^_]+)_/g);
        return subParts.map((subPart, subIdx) => {
          if (subIdx % 2 === 1) {
            return (
              <span key={subIdx} className="font-serif">
                {subPart}
              </span>
            );
          }
          return subPart;
        });
      }
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 1. Heading 1: # Header
    if (line.startsWith("# ")) {
      flushList();
      const headingText = line.replace(/^#\s+/, "");
      elements.push(
        <h1 
          key={keyIndex++} 
          className={`text-2xl md:text-3xl font-display font-extrabold uppercase tracking-wider mt-8 mb-4 ${
            theme === "dark" ? "text-white" : "text-stone-900"
          }`}
        >
          {renderInlineStyles(headingText)}
        </h1>
      );
      continue;
    }

    // 2. Heading 2: ## Header
    if (line.startsWith("## ")) {
      flushList();
      const headingText = line.replace(/^##\s+/, "");
      elements.push(
        <h2 
          key={keyIndex++} 
          className={`text-xl md:text-2xl font-display font-bold uppercase tracking-wider mt-6 mb-3 ${
            theme === "dark" ? "text-white" : "text-stone-900"
          }`}
        >
          {renderInlineStyles(headingText)}
        </h2>
      );
      continue;
    }

    // 3. Heading 3: ### Header
    if (line.startsWith("### ")) {
      flushList();
      const headingText = line.replace(/^###\s+/, "");
      elements.push(
        <h3 
          key={keyIndex++} 
          className={`text-lg md:text-xl font-display font-bold uppercase tracking-wider mt-5 mb-2 ${
            theme === "dark" ? "text-white" : "text-stone-900"
          }`}
        >
          {renderInlineStyles(headingText)}
        </h3>
      );
      continue;
    }

    // 4. Blockquotes: > quote
    if (line.startsWith(">")) {
      flushList();
      const quoteText = line.replace(/^>\s*/, "");
      elements.push(
        <blockquote 
          key={keyIndex++} 
          className={`border-l-2 border-sorside-red pl-4 py-1 my-4 font-serif text-base md:text-lg leading-relaxed ${
            theme === "dark" ? "text-sorside-red/90" : "text-sorside-red"
          }`}
        >
          &ldquo;{renderInlineStyles(quoteText)}&rdquo;
        </blockquote>
      );
      continue;
    }

    // 5. Bullet list: - item or * item
    if (line.startsWith("- ") || line.startsWith("* ")) {
      inList = true;
      const itemText = line.replace(/^[-*]\s+/, "");
      listItems.push(itemText);
      continue;
    }

    // 6. Empty line
    if (line === "") {
      flushList();
      continue;
    }

    // 7. Regular paragraph line
    if (inList) {
      // If we were in a list but this line doesn't start with - or *, close the list
      flushList();
    }

    elements.push(
      <p 
        key={keyIndex++} 
        className={`leading-relaxed tracking-wide my-4 font-serif text-sm md:text-base ${
          theme === "dark" ? "text-zinc-300" : "text-stone-800"
        }`}
      >
        {renderInlineStyles(lines[i])}
      </p>
    );
  }

  // Final list flush
  flushList();

  return <div className="space-y-2">{elements}</div>;
}
