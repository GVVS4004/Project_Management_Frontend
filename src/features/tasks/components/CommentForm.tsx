import { useState } from "react";
import { useCreateComment } from "../hooks/useComments";

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
    placeholder = "Write a comment..."
}: CommentFormProps) => {
    const [content, setContent] = useState("");
    const { mutateAsync: createMutation, isPending } = useCreateComment();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return; // Don't submit empty comments

        await createMutation({ taskId, data: { content, parentCommentId } });
        setContent(""); // Clear the input after successful submission
        onCancel?.(); // Close the form if onCancel is provided (useful for reply forms)
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={placeholder}
                rows={parentCommentId ? 2 : 3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
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
                    disabled={!content.trim() || isPending}
                    className="px-3 py-1.5 text-sm text-white bg-indigo-500 rounded-lg hover:bg-indigo-600"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default CommentForm;