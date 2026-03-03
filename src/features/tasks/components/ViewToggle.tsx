interface ViewToggleProps {
    activeView: 'board' | 'list';
    onViewChange: (view: 'board' | 'list') => void;
}

const ViewToggle = ({ activeView, onViewChange }: ViewToggleProps) => {
    return (
        <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
            <button
                onClick={() => onViewChange('board')}
                className={`px-4 py-2 text-sm font-medium ${activeView === 'board' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                Board
            </button>
            <button
                onClick={() => onViewChange('list')}
                className={`px-4 py-2 text-sm font-medium ${activeView === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-50'}`}
            >
                List
            </button>
        </div>
    );
};

export default ViewToggle;