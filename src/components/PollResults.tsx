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
    <Card className="p-6 bg-gradient-card border-border/20 shadow-card">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold">Live Results</h3>
        </div>
        <Badge variant="secondary" className="bg-primary/20 text-primary">
          {votes.length} / {students.length} votes
        </Badge>
      </div>

      {/* Participation Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/20 rounded-lg border border-border/20">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Participation</span>
          </div>
          <p className="text-2xl font-bold text-primary">{participationRate}%</p>
        </div>
        
        <div className="p-4 bg-muted/20 rounded-lg border border-border/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm font-medium">Total Votes</span>
          </div>
          <p className="text-2xl font-bold text-success">{votes.length}</p>
        </div>
      </div>

      {/* Question Display */}
      <div className="mb-6 p-4 bg-muted/20 rounded-lg border border-border/20">
        <h4 className="font-semibold mb-2">Question:</h4>
        <p className="text-muted-foreground">{activePoll.question}</p>
      </div>

      {/* Results Bars */}
      <div className="space-y-4">
        {results.map((result, index) => {
          const isWinner = winners.includes(result) && winners.length > 0;
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isWinner 
                  ? 'border-success bg-success/10' 
                  : 'border-border/20 bg-muted/20'
              }`}
            >
              {/* Option Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    isWinner 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-primary/20 text-primary'
                  }`}>
                    {result.letter}
                  </div>
                  <span className="font-medium">{result.option}</span>
                  {isWinner && (
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      <Trophy className="w-3 h-3 mr-1" />
                      Winner
                    </Badge>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-lg">{result.votes}</div>
                  <div className="text-sm text-muted-foreground">
                    {result.percentage}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      isWinner 
                        ? 'bg-gradient-to-r from-success to-success/80' 
                        : 'bg-gradient-to-r from-primary to-primary/80'
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
                      className="text-xs bg-muted/20"
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

      {/* Summary */}
      {votes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-border/20">
          <div className="text-center text-sm text-muted-foreground">
            {winners.length > 1 ? (
              <p>It's a tie! Multiple options have the highest votes.</p>
            ) : winners.length === 1 ? (
              <p>
                <strong className="text-success">{winners[0].option}</strong> is currently winning 
                with {winners[0].votes} vote{winners[0].votes !== 1 ? 's' : ''}!
              </p>
            ) : (
              <p>Waiting for votes to determine the winner...</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};