import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { submitVote } from "@/store/pollSlice";
import { PollResults } from "./PollResults";
import { Timer } from "./Timer";
import { 
  User, 
  CheckCircle, 
  Clock,
  Users,
  Vote,
  BarChart3
} from "lucide-react";

/**
 * StudentInterface Component
 * 
 * Main interface for students to:
 * - View their name and connection status
 * - See active poll questions
 * - Submit their votes
 * - View results after voting or time expiry
 */
export const StudentInterface = () => {
  const dispatch = useAppDispatch();
  const { 
    activePoll, 
    studentName, 
    votes, 
    students,
    showResults: resultsVisible,
    isTimerActive,
    timeRemaining
  } = useAppSelector((state) => state.poll);

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current student has already voted
  const hasVoted = votes.some(vote => vote.studentName === studentName);

  // Handle vote submission
  const handleVoteSubmit = () => {
    if (selectedOption === null || hasVoted) return;

    setIsSubmitting(true);

    // Simulate brief loading for better UX
    setTimeout(() => {
      dispatch(submitVote({ selectedOption }));
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Student View</h1>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground text-sm">
            <User className="w-4 h-4" />
            <span>Logged in as {studentName}</span>
          </div>
        </div>

        {!activePoll ? (
          /* No Active Poll */
          <Card className="p-8 bg-card border border-border shadow-card text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Waiting for Poll</h3>
              <p className="text-muted-foreground">
                Your teacher hasn't started a poll yet. Please wait for the next question.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Timer */}
            {isTimerActive && <Timer />}

            {/* Poll Question */}
            <Card className="p-6 bg-card border border-border shadow-card">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Question</h3>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-foreground">{activePoll.question}</p>
                  </div>
                </div>

                {/* Poll Options */}
                {!hasVoted && !resultsVisible && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {activePoll.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedOption(index)}
                          className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                            selectedOption === index
                              ? 'border-primary bg-primary/5 text-foreground'
                              : 'border-border bg-background hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              selectedOption === index
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-muted-foreground'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                selectedOption === index ? 'bg-primary-foreground' : ''
                              }`} />
                            </div>
                            <span className="text-foreground">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <Button
                      onClick={handleVoteSubmit}
                      disabled={selectedOption === null || isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        "Submit Answer"
                      )}
                    </Button>
                  </div>
                )}

                {/* Waiting for Results */}
                {hasVoted && !resultsVisible && (
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <div className="space-y-3">
                      <CheckCircle className="w-12 h-12 text-success mx-auto" />
                      <h4 className="font-semibold text-foreground">Answer Submitted!</h4>
                      <p className="text-sm text-muted-foreground">
                        Waiting for other students to complete their answers...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Results */}
            {resultsVisible && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Poll Results</h3>
                <PollResults />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};