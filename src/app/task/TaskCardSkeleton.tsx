export const TaskCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-solid animate-pulse border-gray-d0-500/50 opca">
      <div className="flex flex-col md:p-4 p-3 z-20">
        <span className="w-full pl-5 bg-gray-600 h-6 rounded-md"></span>
        <span className="w-1/2 mt-1 bg-gray-600 h-4 rounded-md"></span>

        <div className="flex items-center flex-wrap gap-2 mt-2">
          <span className="w-[20%] bg-gray-600 h-4 rounded-md"></span>
          <span className="w-[40%] bg-gray-600 h-4 rounded-md"></span>
          <span className="w-[30%] bg-gray-600 h-4 rounded-md"></span>
        </div>
      </div>
    </div>
  );
};
