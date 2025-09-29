import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";
import { BarChart3, Users, Trophy, TrendingUp } from "lucide-react";

/**
 * PollResults Component
 * 
 * Displays live poll results with:
 * - Vote counts and percentages for each option
 * - Visual progress bars
 * - Winner highlighting
 * - Student vote details
 */
export const PollResults = () => {
  const { activePoll, votes, students } = useAppSelector((state) => state.poll);

  if (!activePoll) return null;

  // Calculate results for each option
  const results = activePoll.options.map((option, index) => {
    const optionVotes = votes.filter(vote => vote.selectedOption === index);
    const percentage = votes.length > 0 ? (optionVotes.length / votes.length) * 100 : 0;
    
    return {
      option,
      letter: String.fromCharCode(65 + index),
      votes: optionVotes.length,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      voters: optionVotes.map(vote => vote.studentName)
    };
  });

  // Find winning option(s)
  const maxVotes = Math.max(...results.map(r => r.votes));
  const winners = results.filter(r => r.votes === maxVotes && r.votes > 0);

  // Calculate participation rate
  const participationRate = students.length > 0 
    ? Math.round((votes.length / students.length) * 100) 
    : 0;

  return (
    <Card className="p-6 bg-card border border-border shadow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Results</h3>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          {votes.length} / {students.length} votes
        </Badge>
      </div>

      {/* Question Display */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <p className="text-foreground font-medium">{activePoll.question}</p>
      </div>

      {/* Results Bars */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const isWinner = winners.includes(result) && winners.length > 0;
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                isWinner 
                  ? 'border-success bg-success/5' 
                  : 'border-border bg-background'
              }`}
            >
              {/* Option Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    isWinner 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {result.letter}
                  </div>
                  <span className="font-medium text-foreground">{result.option}</span>
                  {isWinner && (
                    <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg text-foreground">{result.votes}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isWinner 
                        ? 'bg-success' 
                        : 'bg-primary'
                    }`}
                    style={{ width: `${result.percentage}%` }}
                  />
                </div>
              </div>

              {/* Voters List */}
              {result.voters.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {result.voters.map((voter, voterIndex) => (
                    <Badge 
                      key={voterIndex}
                      variant="outline" 
                      className="text-xs"
                    >
                      {voter}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Votes Yet */}
      {votes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No votes submitted yet</p>
          <p className="text-sm">Results will appear as students vote</p>
        </div>
      )}
    </Card>
  );
};