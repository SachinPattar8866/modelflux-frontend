export default function SwitchingIndicator({ message }) {
  if (!message) return null;

  return (
    <div className="flex justify-start mb-3">
      <div className="px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 text-sm italic animate-pulse">
        {message}
      </div>
    </div>
  );
}