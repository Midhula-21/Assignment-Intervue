import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the structure of our poll system state
export interface Poll {
  id: string;
  question: string;
  options: string[];
  createdAt: number;
  timeLimit: number; // in seconds
}

export interface Vote {
  studentName: string;
  pollId: string;
  selectedOption: number;
  timestamp: number;
}

export interface Student {
  name: string;
  hasVoted: boolean;
  joinedAt: number;
}

interface PollState {
  // Current active poll (null if no poll is active)
  activePoll: Poll | null;
  
  // All votes for the current poll
  votes: Vote[];
  
  // Connected students
  students: Student[];
  
  // Current user's role and info
  userRole: 'teacher' | 'student' | null;
  studentName: string;
  
  // Poll timer
  timeRemaining: number;
  isTimerActive: boolean;
  
  // UI states
  showResults: boolean;
  
  // Past polls for history
  pollHistory: Poll[];
}

const initialState: PollState = {
  activePoll: null,
  votes: [],
  students: [],
  userRole: null,
  studentName: '',
  timeRemaining: 0,
  isTimerActive: false,
  showResults: false,
  pollHistory: [],
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    // Teacher actions
    setUserRole: (state, action: PayloadAction<'teacher' | 'student'>) => {
      state.userRole = action.payload;
    },
    
    // Create a new poll (teacher only)
    createPoll: (state, action: PayloadAction<{ question: string; options: string[]; timeLimit?: number }>) => {
      const { question, options, timeLimit = 60 } = action.payload;
      
      state.activePoll = {
        id: Date.now().toString(),
        question,
        options,
        createdAt: Date.now(),
        timeLimit,
      };
      
      // Reset poll state
      state.votes = [];
      state.timeRemaining = timeLimit;
      state.isTimerActive = true;
      state.showResults = false;
      
      // Reset all students' voted status
      state.students = state.students.map(student => ({
        ...student,
        hasVoted: false,
      }));
    },
    
    // Student actions
    setStudentName: (state, action: PayloadAction<string>) => {
      state.studentName = action.payload;
      state.userRole = 'student';
      
      // Add student to the list if not already present
      const existingStudent = state.students.find(s => s.name === action.payload);
      if (!existingStudent) {
        state.students.push({
          name: action.payload,
          hasVoted: false,
          joinedAt: Date.now(),
        });
      }
    },
    
    // Submit a vote (student only)
    submitVote: (state, action: PayloadAction<{ selectedOption: number }>) => {
      if (!state.activePoll || !state.studentName) return;
      
      const { selectedOption } = action.payload;
      
      // Remove any existing vote from this student
      state.votes = state.votes.filter(vote => vote.studentName !== state.studentName);
      
      // Add new vote
      state.votes.push({
        studentName: state.studentName,
        pollId: state.activePoll.id,
        selectedOption,
        timestamp: Date.now(),
      });
      
      // Update student's voted status
      const student = state.students.find(s => s.name === state.studentName);
      if (student) {
        student.hasVoted = true;
      }
      
      // Check if all students have voted
      const allStudentsVoted = state.students.length > 0 && 
        state.students.every(student => student.hasVoted);
      
      if (allStudentsVoted) {
        state.showResults = true;
        state.isTimerActive = false;
      }
    },
    
    // Timer actions
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      } else {
        state.isTimerActive = false;
        state.showResults = true;
      }
    },
    
    startTimer: (state) => {
      state.isTimerActive = true;
    },
    
    stopTimer: (state) => {
      state.isTimerActive = false;
    },
    
    // Results actions
    showResults: (state) => {
      state.showResults = true;
      state.isTimerActive = false;
    },
    
    hideResults: (state) => {
      state.showResults = false;
    },
    
    // End current poll and move to history
    endPoll: (state) => {
      if (state.activePoll) {
        state.pollHistory.unshift(state.activePoll);
        state.activePoll = null;
        state.votes = [];
        state.timeRemaining = 0;
        state.isTimerActive = false;
        state.showResults = false;
        
        // Reset all students' voted status
        state.students = state.students.map(student => ({
          ...student,
          hasVoted: false,
        }));
      }
    },
    
    // Remove a student (teacher only)
    removeStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(student => student.name !== action.payload);
      state.votes = state.votes.filter(vote => vote.studentName !== action.payload);
    },
  },
});

export const {
  setUserRole,
  createPoll,
  setStudentName,
  submitVote,
  decrementTimer,
  startTimer,
  stopTimer,
  showResults,
  hideResults,
  endPoll,
  removeStudent,
} = pollSlice.actions;

export default pollSlice.reducer;