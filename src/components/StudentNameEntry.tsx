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
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-gradient-card border-border/20 shadow-card">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-accent flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-accent-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Enter Your Name</h2>
            <p className="text-muted-foreground">
              Please provide your name to join the polling session
            </p>
          </div>

          {/* Name Entry Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="student-name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="student-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-primary focus:border-primary"
                maxLength={50}
                required
                autoFocus
              />
              <p className="text-xs text-muted-foreground">
                This name will be visible to your teacher and other students
              </p>
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full bg-gradient-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2" />
                  Joining...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Join Session
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>
          </form>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-muted/20 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Note:</strong> Your name is unique to this browser session. 
              You can change it by refreshing the page.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};