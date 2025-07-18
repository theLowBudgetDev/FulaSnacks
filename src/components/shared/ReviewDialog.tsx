
"use client";

import { useState } from "react";
import type { Snack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  snack: Snack;
}

export function ReviewDialog({ open, onOpenChange, snack }: ReviewDialogProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
        toast({
            variant: "destructive",
            title: "Rating required",
            description: "Please select a star rating."
        });
        return;
    }
    
    // In a real app, you'd submit this review to a backend.
    console.log({ snackId: snack.id, rating, comment });

    toast({
        title: "Review Submitted!",
        description: `Thanks for your feedback on ${snack.name}.`
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>
            How was the {snack.name}? Share your thoughts with other students.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="space-y-2">
                 <p className="text-sm font-medium">Your Rating</p>
                 <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                     {[...Array(5)].map((_, index) => {
                         const starValue = index + 1;
                         return (
                             <Star 
                                key={starValue}
                                className={cn("h-8 w-8 cursor-pointer transition-colors",
                                starValue <= (hoverRating || rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground"
                                )}
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                             />
                         )
                     })}
                 </div>
            </div>
            <div className="space-y-2">
                <label htmlFor="comment" className="text-sm font-medium">Your Comments (Optional)</label>
                <Textarea 
                    id="comment"
                    placeholder="Tell us more about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
