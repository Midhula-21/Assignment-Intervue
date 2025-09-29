import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { setUserRole } from "@/store/pollSlice";
import { GraduationCap, Users } from "lucide-react";

/**
 * RoleSelector Component
 * 
 * Allows users to choose between Teacher and Student roles
 * This is the first screen users see when entering the polling system
 */
export const RoleSelector = () => {
  const dispatch = useAppDispatch();

  // Handle role selection and update Redux state
  const handleRoleSelect = (role: 'teacher' | 'student') => {
    dispatch(setUserRole(role));
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            Live Polling System
          </h1>
          <p className="text-xl text-primary-foreground/80">
            Choose your role to get started with real-time polling
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Teacher Card */}
          <Card className="bg-gradient-card border-border/20 shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Teacher</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Create polls, manage questions, and view real-time results from your students
              </p>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div>✓ Create new polls</div>
                <div>✓ View live results</div>
                <div>✓ Manage students</div>
                <div>✓ Set time limits</div>
              </div>
              
              <Button 
                onClick={() => handleRoleSelect('teacher')}
                className="w-full bg-gradient-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Join as Teacher
              </Button>
            </div>
          </Card>

          {/* Student Card */}
          <Card className="bg-gradient-card border-border/20 shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer">
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-accent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-accent-foreground" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-4">Student</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join polls, submit your answers, and see how your responses compare to others
              </p>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div>✓ Enter your name</div>
                <div>✓ Answer questions</div>
                <div>✓ View results</div>
                <div>✓ Real-time updates</div>
              </div>
              
              <Button 
                onClick={() => handleRoleSelect('student')}
                className="w-full bg-gradient-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 rounded-lg transition-all duration-300"
              >
                Join as Student
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-primary-foreground/60 text-sm">
            Real-time polling with instant results • Built for education and engagement
          </p>
        </div>
      </div>
    </div>
  );
};