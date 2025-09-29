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
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Student Dashboard</h1>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <User className="w-4 h-4" />
            <span>Welcome, {studentName}</span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Connection Status */}
          <Card className="p-6 bg-gradient-card border-border/20 shadow-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="font-semibold">Connected</p>
                <p className="text-sm text-muted-foreground">Ready to participate</p>
              </div>
            </div>
          </Card>

          {/* Students Count */}
          <Card className="p-6 bg-gradient-card border-border/20 shadow-card">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </Card>

          {/* Vote Status */}
          <Card className="p-6 bg-gradient-card border-border/20 shadow-card">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${hasVoted ? 'bg-success/20' : 'bg-muted/20'}`}>
                <Vote className={`w-6 h-6 ${hasVoted ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-semibold">{hasVoted ? 'Voted' : 'Not Voted'}</p>
                <p className="text-sm text-muted-foreground">
                  {hasVoted ? 'Answer submitted' : 'Waiting to vote'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Left Column - Poll Question or Status */}
          <div className="space-y-6">
            
            {!activePoll ? (
              /* No Active Poll */
              <Card className="p-8 bg-gradient-card border-border/20 shadow-card text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">Waiting for Poll</h3>
                  <p className="text-muted-foreground">
                    Your teacher hasn't started a poll yet. Please wait for the next question.
                  </p>
                </div>
              </Card>
            ) : (
              /* Active Poll */
              <Card className="p-6 bg-gradient-card border-border/20 shadow-card">
                <div className="space-y-6">
                  
                  {/* Timer */}
                  {isTimerActive && (
                    <Timer />
                  )}

                  {/* Poll Question */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">Question</h3>
                      {hasVoted && (
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Submitted
                        </Badge>
                      )}
                    </div>
                    
                    <div className="p-4 bg-muted/20 rounded-lg border border-border/20">
                      <p className="text-lg">{activePoll.question}</p>
                    </div>
                  </div>

                  {/* Poll Options */}
                  {!hasVoted && !resultsVisible && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Choose your answer:</h4>
                      <div className="space-y-2">
                        {activePoll.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedOption(index)}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                              selectedOption === index
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border bg-muted/20 hover:bg-muted/30'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedOption === index
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-muted-foreground'
                              }`}>
                                <span className="text-sm font-semibold">
                                  {String.fromCharCode(65 + index)}
                                </span>
                              </div>
                              <span>{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleVoteSubmit}
                        disabled={selectedOption === null || isSubmitting}
                        className="w-full bg-gradient-primary hover:bg-primary/90 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Vote className="w-4 h-4 mr-2" />
                            Submit Answer
                          </div>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Waiting for Results */}
                  {hasVoted && !resultsVisible && (
                    <div className="text-center p-6 bg-muted/20 rounded-lg border border-border/20">
                      <div className="space-y-3">
                        <CheckCircle className="w-12 h-12 text-success mx-auto" />
                        <h4 className="font-semibold">Answer Submitted!</h4>
                        <p className="text-sm text-muted-foreground">
                          Waiting for other students to complete their answers...
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {votes.length} of {students.length} students have voted
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Results */}
          <div>
            {activePoll && resultsVisible && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold">Poll Results</h3>
                </div>
                <PollResults />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};