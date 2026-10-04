export default function SwitchingIndicator({ message }) {
  if (!message) return null;

  return (
    <div className="self-start rounded-full bg-accent-wash px-3.5 py-1.5 text-[12.5px] font-semibold text-accent animate-pulse">
      {message}
    </div>
  );
}