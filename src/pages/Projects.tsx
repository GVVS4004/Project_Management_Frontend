import ProjectCard from "../features/projects/components/ProjectCard";
import ProjectListItem from "../features/projects/components/ProjectListItem";
import ProjectsPage from "../features/projects/pages/ProjectsPage";
import { ProjectStatus } from "../features/projects/types/project.types";

const Projects = () => {
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Projects</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Your projects will appear here.</p>
        </div>

        {/* <ProjectCard
          project={{
            id: 1,
            name: "Sample Project",
            description: "This is a sample project description. lasfdjnlvjkbfvljwbedlfvbalkdjfvbhedfbvljbfvljbdfkvbdskfvbhdljfvbhjfbvsdhbfvb hdsfkjhvbskdjhbfhvdkh",
            status: ProjectStatus.ABANDONED,
            owner: {
              id: 1,
              userName: "sampleuser",
              firstName: "Sample",
              lastName: "User",
              email: "sample@example.com",
              profileImageUrl: null,
            },
            startDate: new Date().toDateString(),
            endDate: new Date().toDateString(),
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString(),
          }}
        /> */}
        {/* <ProjectListItem
          project={{
            id: 1,
            name: "Sample Project jdkfnioqeb ofdovi aofhivue jkafvbhohdf",
            description: "This is a sample project description. lasfdjnlvjkbfvljwbedlfvbalkdjfvbhedfbvljbfvljbdfkvbdskfvbhdljfvbhjfbvsdhbfvb hdsfkjhvbskdjhbfhvdkh",  
            status: ProjectStatus.ABANDONED,
            owner: {
              id: 1,
              userName: "sampleuser",
              firstName: "Sample",
              lastName: "User",
              email: "user@email.com",
              profileImageUrl: null,
            },
            startDate: new Date().toDateString(),
            endDate: new Date().toDateString(),
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString(),
          }}
        /> */}
        <ProjectsPage></ProjectsPage>
      </div>
    </div>
  );
};

export default Projects;
