import { useComments } from "../hooks/useComments";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentListProps {
  taskId: number;
  currentUserId: number;
}

const CommentList = ({ taskId, currentUserId }: CommentListProps) => {
  const { data: comments, isLoading, isError } = useComments(taskId);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Comments {comments && comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* New comment form */}
      <div className="mb-6">
        <CommentForm taskId={taskId} />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-sm text-red-600 py-4">Failed to load comments.</p>
      )}

      {/* Empty */}
      {!isLoading && !isError && comments?.length === 0 && (
        <p className="text-sm text-gray-400 py-4">
          No comments yet. Be the first to comment!
        </p>
      )}

      {/* Comment list */}
      <div className="divide-y divide-gray-100">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            taskId={taskId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
