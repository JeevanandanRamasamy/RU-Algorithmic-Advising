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
