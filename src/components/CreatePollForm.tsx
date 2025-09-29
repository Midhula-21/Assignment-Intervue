import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/store/hooks";
import { createPoll } from "@/store/pollSlice";
import { X, Plus, Minus, Clock } from "lucide-react";

interface CreatePollFormProps {
  onClose: () => void;
}

/**
 * CreatePollForm Component
 * 
 * Modal form for teachers to create new polls with:
 * - Poll question
 * - Multiple choice options (2-6 options)
 * - Configurable time limit
 */
export const CreatePollForm = ({ onClose }: CreatePollFormProps) => {
  const dispatch = useAppDispatch();
  
  // Form state
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new option (max 6 options)
  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  // Remove option (min 2 options)
  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  // Update specific option
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!question.trim()) return;
    
    const validOptions = options.filter(option => option.trim());
    if (validOptions.length < 2) {
      alert("Please provide at least 2 options");
      return;
    }

    setIsSubmitting(true);

    // Create poll with a brief delay for UX
    setTimeout(() => {
      dispatch(createPoll({
        question: question.trim(),
        options: validOptions.map(option => option.trim()),
        timeLimit
      }));
      
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
      <Card className="w-full max-w-2xl bg-gradient-card border-border/20 shadow-card max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Create New Poll</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="hover:bg-muted/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Poll Question */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium">
                Poll Question *
              </Label>
              <Textarea
                id="question"
                placeholder="Enter your poll question here..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[80px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground text-right">
                {question.length}/200 characters
              </p>
            </div>

            {/* Poll Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Answer Options * (2-6 options)
                </Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() => removeOption(options.length - 1)}
                    disabled={options.length <= 2}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/20 disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addOption()}
                    disabled={options.length >= 6}
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/20 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                      maxLength={100}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <Label htmlFor="timeLimit" className="text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Time Limit (seconds)
              </Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="timeLimit"
                  type="number"
                  min="10"
                  max="600"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                  className="w-32 bg-input border-border text-foreground focus:ring-primary focus:border-primary"
                />
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimeLimit(30)}
                    className={timeLimit === 30 ? "bg-primary/20 text-primary" : ""}
                  >
                    30s
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimeLimit(60)}
                    className={timeLimit === 60 ? "bg-primary/20 text-primary" : ""}
                  >
                    1m
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimeLimit(120)}
                    className={timeLimit === 120 ? "bg-primary/20 text-primary" : ""}
                  >
                    2m
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Students will have {timeLimit} seconds to answer
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!question.trim() || options.filter(o => o.trim()).length < 2 || isSubmitting}
                className="flex-1 bg-gradient-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Creating...
                  </div>
                ) : (
                  "Create Poll"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};