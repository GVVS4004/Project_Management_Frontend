import { useState } from "react";
import { useCreateComment } from "../hooks/useComments";
import RichTextEditor from "../../../components/editor/RichTextEditor";

interface CommentFormProps {
  taskId: number;
  parentCommentId?: number | null;
  onCancel?: () => void;
  placeholder?: string;
}

const CommentForm = ({
  taskId,
  parentCommentId = null,
  onCancel,
  placeholder = "Write a comment...",
}: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [editorKey, setEditorKey] = useState(0);
  const { mutateAsync: createMutation, isPending } = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content === "<p></p>") return;

    await createMutation({ taskId, data: { content, parentCommentId } });
    setContent("");
    setEditorKey((prev) => prev + 1);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <RichTextEditor
        key={editorKey}
        content={content}
        onChange={setContent}
        placeholder={placeholder}
        enableMentions={true}
      />
      <div className="flex items-center gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || content === "<p></p>" || isPending}
          className="px-3 py-1.5 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
