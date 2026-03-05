import { useState } from "react";
import type { Comment } from "../types/comment.types";
import { useUpdateComment, useDeleteComment } from "../hooks/useComments";
import CommentForm from "./CommentForm";
import Avatar from "../../../components/Avatar";
import { timeAgo } from "../../../utils/timeAgo";
import RichTextEditor from "../../../components/editor/RichTextEditor";
import RichTextContent from "../../../components/editor/RichTextContent";

interface CommentItemProps {
  comment: Comment;
  taskId: number;
  currentUserId: number;
}

const CommentItem = ({ comment, taskId, currentUserId }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const updateCommentMutation = useUpdateComment();
  const deleteCommentMutation = useDeleteComment();

  const isAuthor = comment.author.id === currentUserId;

  const handleEdit = async () => {
    if (!editedContent.trim()) return;

    await updateCommentMutation.mutateAsync({
      taskId,
      commentId: comment.id,
      data: { content: editedContent.trim() },
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteCommentMutation.mutateAsync({ taskId, commentId: comment.id });
  };

  if (comment.isDeleted) {
    return (
      <div className={`${comment.depth > 0 ? "ml-8" : ""}`}>
        <div className="py-3 px-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-400 italic">
            [This comment was deleted]
          </p>
        </div>
        {/* Still render replies even if parent is deleted */}
        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            taskId={taskId}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`${comment.depth > 0 ? "ml-8" : ""}`}>
      <div className="py-3">
        <div className="flex items-center gap-2 mb-1">
          <Avatar
            src={comment.author.profileImageUrl ?? ""}
            alt={`${comment.author.firstName} ${comment.author.lastName}`}
          />
          <span className="text-sm font-medium text-gray-900">
            {comment.author.firstName} {comment.author.lastName}
          </span>
          <span className="text-xs text-gray-500">.</span>
          <span className="text-xs text-gray-500">
            {timeAgo(comment.createdAt)}
          </span>
          {comment.isEdited && (
            <span className="text-xs text-gray-400 italic">(edited)</span>
          )}
        </div>
        {isEditing ? (
          <div className="mt-2 space-y-2">
            <RichTextEditor
              content={editedContent}
              onChange={setEditedContent}
              placeholder="Edit your comment..."
              enableMentions={true}
            />
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                disabled={
                  !editedContent.trim() || updateCommentMutation.isPending
                }
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {updateCommentMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <RichTextContent
            content={comment.content}
            className="text-sm text-gray-700"
          />
        )}

        {/* Action buttons */}
        {!isEditing && (
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs text-gray-500 hover:text-indigo-600"
            >
              Reply
            </button>
            {isAuthor && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedContent(comment.content);
                  }}
                  className="text-xs text-gray-500 hover:text-indigo-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div>
        )}

        {isReplying && (
          <div className="mt-3 ml-8">
            <CommentForm
              taskId={taskId}
              parentCommentId={comment.id}
              onCancel={() => setIsReplying(false)}
            />
          </div>
        )}
      </div>

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          taskId={taskId}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default CommentItem;
