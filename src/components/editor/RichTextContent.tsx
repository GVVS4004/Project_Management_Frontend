import DOMPurify from "dompurify";
interface RichTextContentProps {
  content: string;
  className?: string;
}

const RichTextContent = ({ content, className = "" }: RichTextContentProps) => {
  const sanitized = DOMPurify.sanitize(content, {
    ADD_TAGS: ["video"],
    ADD_ATTR: ["controls", "contenttype"],
  });

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default RichTextContent;
