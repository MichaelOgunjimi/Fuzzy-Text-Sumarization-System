import fileTextIcon from '/file-text.svg';

export default function PickedFile({ fileName, onRemove= =n }) {
  return (
    <div className="bg-background-100 rounded-lg p-3 relative sm:w-auto">
      <div className="flex items-center gap-2">
        <img src={fileTextIcon} alt="File" className="w-8 h-8" />
        <p className="text-lg font-bold truncate text-text-600">{fileName}</p>
      </div>
      <button
        type="button"
        className="absolute -top-0 -right-2 -translate-y-1/2 hover:text-accent-500 transition-colors bg-accent-400 rounded-full p-0.5"
        onClick={onRemove}
      >
        <svg
          className="w-6 h-6 text-text-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
fd