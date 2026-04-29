"use client";

type SpeakButtonProps = {
  text: string;
  label?: string;
};

export default function SpeakButton({ text, label = "🔊 Nghe" }: SpeakButtonProps) {
  function handleSpeak() {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      alert("Trình duyệt của bạn chưa hỗ trợ phát âm.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <button
      type="button"
      onClick={handleSpeak}
      aria-label={`Nghe phát âm ${text}`}
      className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
    >
      {label}
    </button>
  );
}
