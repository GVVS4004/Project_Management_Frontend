import { ProjectStatus } from '../types/project.types'

const ProjectStatusItem = ({status}:{status: ProjectStatus}) => {
  return (
    <div >
      <span className={`px-2 py-1 rounded-md text-white text-sm font-semibold ${
        status === ProjectStatus.ACTIVE ? 'bg-green-500' :
        status === ProjectStatus.COMPLETED ? 'bg-blue-500' :
        status === ProjectStatus.ON_HOLD ? 'bg-yellow-500' :
        status === ProjectStatus.ABANDONED ? 'bg-red-500' :
        status === ProjectStatus.PLANNING ? 'bg-purple-500' :
        'bg-gray-500'
      }`}>
        {status}
      </span>
    </div>
  )
}

export default ProjectStatusItem
