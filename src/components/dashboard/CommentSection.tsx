
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/features/dashboard/dashboardSlice";
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  title?: string;
  comments: Comment[];
  documentId: string;
  onAddComment: (content: string) => void;
}

export default function CommentSection({
  title = "Comments & Feedback",
  comments,
  documentId,
  onAddComment,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    onAddComment(newComment);
    setNewComment("");
  };

  // Filter comments for this document
  const documentComments = comments.filter(comment => comment.documentId === documentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
          {documentComments.length > 0 ? (
            documentComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.userAvatar} />
                  <AvatarFallback>{comment.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-medium">{comment.userName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet</p>
          )}
        </div>
        
        <form onSubmit={handleSubmit}>
          <Textarea
            placeholder="Add your comment..."
            className="mb-3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Add Comment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
