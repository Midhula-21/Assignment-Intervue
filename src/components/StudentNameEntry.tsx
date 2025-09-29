import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/store/hooks";
import { setStudentName } from "@/store/pollSlice";
import { User, ArrowRight } from "lucide-react";

/**
 * StudentNameEntry Component
 * 
 * Allows students to enter their name before joining the polling session
 * Names are unique per browser tab/session
 */
export const StudentNameEntry = () => {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  // Handle form submission to set student name
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate brief loading for better UX
    setTimeout(() => {
      dispatch(setStudentName(name.trim()));
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card border border-border shadow-card">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Let's Get Started!</h2>
            <p className="text-muted-foreground text-sm">
              Please enter your name to join the session
            </p>
          </div>

          {/* Name Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="student-name" className="text-sm font-medium text-foreground">
                Your Name
              </Label>
              <Input
                id="student-name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                maxLength={50}
                required
                autoFocus
              />
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Joining...
                </div>
              ) : (
                "Continue"
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};