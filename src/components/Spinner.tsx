import { FaCircleNotch } from "react-icons/fa";

export const Spinner = () => {
  return (
    <div className="text-white hover:text-[#162341] w-full h-[48px] flex items-center">
      <FaCircleNotch className="animate-spin text-[16px] text-inherit w-full" />
    </div>
  );
};
