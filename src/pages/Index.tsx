import { useAppSelector } from "@/store/hooks";
import { RoleSelector } from "@/components/RoleSelector";
import { StudentNameEntry } from "@/components/StudentNameEntry";
import { TeacherDashboard } from "@/components/TeacherDashboard";
import { StudentInterface } from "@/components/StudentInterface";

/**
 * Main Index Page
 * 
 * Routes users based on their role and state:
 * - No role selected: Show role selector
 * - Student without name: Show name entry
 * - Teacher: Show teacher dashboard
 * - Student with name: Show student interface
 */
const Index = () => {
  const { userRole, studentName } = useAppSelector((state) => state.poll);

  // Route based on user state
  if (!userRole) {
    return <RoleSelector />;
  }

  if (userRole === 'student' && !studentName) {
    return <StudentNameEntry />;
  }

  if (userRole === 'teacher') {
    return <TeacherDashboard />;
  }

  if (userRole === 'student' && studentName) {
    return <StudentInterface />;
  }

  // Fallback (should never reach here)
  return <RoleSelector />;
};

export default Index;
