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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Live Polling System
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your role to get started
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Teacher Card */}
          <Card className="bg-card border border-border shadow-card hover:shadow-lg transition-all duration-200 group cursor-pointer">
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">Teacher</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Create and manage polls for your students
              </p>
              
              <Button 
                onClick={() => handleRoleSelect('teacher')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
              >
                Continue as Teacher
              </Button>
            </div>
          </Card>

          {/* Student Card */}
          <Card className="bg-card border border-border shadow-card hover:shadow-lg transition-all duration-200 group cursor-pointer">
            <div className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">Student</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Join polls and submit your answers
              </p>
              
              <Button 
                onClick={() => handleRoleSelect('student')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2.5"
              >
                Continue as Student
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};