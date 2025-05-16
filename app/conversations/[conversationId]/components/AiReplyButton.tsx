'use client';

import { HiOutlineChat } from "react-icons/hi";

interface AiReplyButtonProps {
  onClick: () => void;
}

const AiReplyButton: React.FC<AiReplyButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
    >
      <HiOutlineChat size={18} className="text-white" />
    </button>
  );
};

export default AiReplyButton;
