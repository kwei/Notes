import Image from "next/image";
import Me from "../../public/me.jpg";

export const MyInfo = () => {
  return (
    <div className="flex items-center gap-4">
      <Image className='size-6' src={Me} alt='me' />
      <span className="font-bold">KW Yeh</span>
    </div>
  );
};
