import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { endPoll, removeStudent, showResults } from "@/store/pollSlice";
import { CreatePollForm } from "./CreatePollForm";
import { PollResults } from "./PollResults";
import { Timer } from "./Timer";
import { 
  Users, 
  PlusCircle, 
  BarChart3, 
  Trash2, 
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

/**
 * TeacherDashboard Component
 * 
 * Main interface for teachers to:
 * - Create new polls
 * - View connected students
 * - Manage active polls
 * - View poll results
 * - Remove students if needed
 */
export const TeacherDashboard = () => {
  const dispatch = useAppDispatch();
  const { 
    activePoll, 
    students, 
    votes, 
    showResults: resultsVisible,
    isTimerActive,
    timeRemaining
  } = useAppSelector((state) => state.poll);

  const [showCreateForm, setShowCreateForm] = useState(false);

  // Check if teacher can create a new poll
  const canCreateNewPoll = !activePoll || 
    (students.length > 0 && students.every(student => student.hasVoted));

  // Handle ending current poll
  const handleEndPoll = () => {
    dispatch(endPoll());
    setShowCreateForm(false);
  };

  // Handle showing results manually
  const handleShowResults = () => {
    dispatch(showResults());
  };

  // Handle removing a student
  const handleRemoveStudent = (studentName: string) => {
    if (confirm(`Are you sure you want to remove ${studentName}?`)) {
      dispatch(removeStudent(studentName));
    }
  };

  // Calculate voting progress
  const votingProgress = students.length > 0 
    ? (votes.length / students.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Manage your polls and engage with students
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* Left Column - Poll Management */}
          <div className="space-y-6">
            
            {/* Create Poll Section */}
            <Card className="p-6 bg-card border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Poll Management</h3>
                {activePoll && (
                  <Badge variant="secondary" className="bg-success/20 text-success">
                    Active
                  </Badge>
                )}
              </div>

              {/* Timer Display */}
              {activePoll && isTimerActive && (
                <div className="mb-4">
                  <Timer />
                </div>
              )}

              {/* Current Poll Info */}
              {activePoll && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 text-foreground">Current Question:</h4>
                  <p className="text-sm text-muted-foreground mb-3">{activePoll.question}</p>
                  <div className="space-y-1">
                    {activePoll.options.map((option, index) => (
                      <div key={index} className="text-sm text-foreground">
                        <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {!activePoll && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Poll
                  </Button>
                )}

                {activePoll && !canCreateNewPoll && !resultsVisible && (
                  <div className="space-y-2">
                    <Button
                      onClick={handleShowResults}
                      variant="outline"
                      className="w-full"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Show Results Now
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      {votes.length} of {students.length} students have voted
                    </p>
                  </div>
                )}

                {activePoll && canCreateNewPoll && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create New Poll
                  </Button>
                )}

                {activePoll && (
                  <Button
                    onClick={handleEndPoll}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    End Current Poll
                  </Button>
                )}
              </div>
            </Card>

            {/* Students List */}
            <Card className="p-6 bg-card border border-border shadow-card">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Connected Students ({students.length})</h3>
              
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No students connected yet</p>
                  <p className="text-sm">Students will appear here when they join</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.name}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          student.hasVoted ? 'bg-success' : 'bg-muted-foreground'
                        }`} />
                        <span className="font-medium text-foreground">{student.name}</span>
                        {student.hasVoted && (
                          <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Voted
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={() => handleRemoveStudent(student.name)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            {activePoll && resultsVisible ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Poll Results</h3>
                <PollResults />
              </div>
            ) : (
              <Card className="p-8 bg-card border border-border shadow-card text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <BarChart3 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No Results Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Results will appear here once you show them or the poll ends
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Create Poll Modal */}
        {showCreateForm && (
          <CreatePollForm onClose={() => setShowCreateForm(false)} />
        )}
      </div>
    </div>
  );
};