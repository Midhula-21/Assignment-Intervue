import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { decrementTimer } from "@/store/pollSlice";
import { Clock, AlertTriangle } from "lucide-react";

/**
 * Timer Component
 * 
 * Shows countdown timer for active polls
 * Automatically updates every second and triggers results when time expires
 */
export const Timer = () => {
  const dispatch = useAppDispatch();
  const { timeRemaining, isTimerActive } = useAppSelector((state) => state.poll);

  // Handle timer countdown
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      dispatch(decrementTimer());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch, isTimerActive, timeRemaining]);

  // Don't render if timer is not active
  if (!isTimerActive && timeRemaining <= 0) {
    return null;
  }

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Determine timer style based on remaining time
  const getTimerStyle = () => {
    if (timeRemaining <= 10) {
      return "text-destructive animate-pulse";
    } else if (timeRemaining <= 30) {
      return "text-warning";
    }
    return "text-primary";
  };

  const getIconColor = () => {
    if (timeRemaining <= 10) {
      return "text-destructive";
    } else if (timeRemaining <= 30) {
      return "text-warning";
    }
    return "text-primary";
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-4 bg-card rounded-lg border border-border/20 shadow-card">
      {timeRemaining <= 30 ? (
        <AlertTriangle className={`w-5 h-5 ${getIconColor()}`} />
      ) : (
        <Clock className={`w-5 h-5 ${getIconColor()}`} />
      )}
      
      <div className="flex flex-col items-center">
        <span className={`text-2xl font-bold font-mono ${getTimerStyle()}`}>
          {formatTime(timeRemaining)}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          Time Remaining
        </span>
      </div>
    </div>
  );
};