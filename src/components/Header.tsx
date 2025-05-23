type HeaderProps = {
  onCreate: () => void;
  isOnline: boolean;
};

const Header = ({ onCreate, isOnline }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <div className="flex items-center gap-4">
        {/* Online/Offline Indicator */}
        <span
          className={`h-3 w-3 rounded-full ${
            isOnline ? "bg-green-400" : "bg-red-400"
          }`}
          title={isOnline ? "Online" : "Offline"}
        />
        <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
      </div>

      {/* Create New Note */}
      <button
        onClick={onCreate}
        className="bg-blue-600 px-4 py-1 rounded hover:bg-blue-500 transition text-sm cursor-pointer"
      >
        + New Note
      </button>
    </header>
  );
};

export default Header;
