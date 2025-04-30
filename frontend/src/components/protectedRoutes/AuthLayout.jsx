/**
 * AuthLayout Component (Protected Route Wrapper)
 *
 * This component wraps all student-related routes that require authentication
 * and shared context providers. It ensures the user is authenticated before
 * rendering the route via <RequireAuth>. If authenticated, it sets up a
 * series of nested context providers that manage shared global state for:
 *
 * - Student details
 * - Available programs
 * - Course data and records
 * - Requirement trees
 * - Section info
 * - Taken/completed courses
 *
 * The <Outlet /> renders the matching child route inside this layout.
 *
 * Usage:
 * This component should be used in the routing tree for protected `/student/...` pages.
 */

import { Outlet } from "react-router-dom";
import { CoursesProvider } from "../../context/CoursesContext";
import { CourseRecordsProvider } from "../../context/CourseRecordsContext";
import { CourseRequirementsProvider } from "../../context/CourseRequirementContext";
import { SectionsProvider } from "../../context/SectionsContext";
import { TakenCoursesProvider } from "../../context/TakenCoursesContext";
import RequireAuth from "./RequireAuth";
import { StudentDetailsProvider } from "../../context/StudentDetailsContext";
import { ProgramsProvider } from "../../context/ProgramsContext";

const AuthLayout = () => {
  return (
    <RequireAuth>
      <StudentDetailsProvider>
        <ProgramsProvider>
          <CoursesProvider>
            <CourseRequirementsProvider>
              <SectionsProvider>
                <TakenCoursesProvider>
                  <CourseRecordsProvider>
                    <Outlet />
                  </CourseRecordsProvider>
                </TakenCoursesProvider>
              </SectionsProvider>
            </CourseRequirementsProvider>
          </CoursesProvider>
        </ProgramsProvider>
      </StudentDetailsProvider>
    </RequireAuth>
  );
};

export default AuthLayout;
