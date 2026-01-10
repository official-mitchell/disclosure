import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface MarkdownTextProps {
  content: string;
}

export default function MarkdownText({ content }: MarkdownTextProps) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        // Render paragraphs with spacing
        p: ({ children }) => <p style={{ marginBottom: 'clamp(1rem, 2.5vw, 1.5rem)' }}>{children}</p>,
        // Bold text
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        // Italic text
        em: ({ children }) => <em className="italic">{children}</em>,
        // HTML bold tag
        b: ({ children }) => <strong className="font-semibold">{children}</strong>,
        // HTML italic tag
        i: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
