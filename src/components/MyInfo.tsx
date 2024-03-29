import Image from "next/image";
import Me from "../../public/me.jpg";

export const MyInfo = () => {
  return (
    <div className="flex items-center gap-4">
      <Image className='max-md:hidden size-10 m-0 rounded-full border border-solid border-gray-500' src={Me} alt='me' />
      <span className="font-bold">KW Yeh</span>
    </div>
  );
};
