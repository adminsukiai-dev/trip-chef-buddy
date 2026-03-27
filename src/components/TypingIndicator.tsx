const TypingIndicator = () => (
  <div className="flex items-center gap-3">
    <div className="grocer-bubble-ai flex items-center gap-1.5 py-4 px-5">
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-typing-1" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-typing-2" />
      <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-typing-3" />
    </div>
  </div>
);

export default TypingIndicator;
