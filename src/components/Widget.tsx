import { useEffect, useState } from "react";

const Widget = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => count + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-10 mb-6 text-3xl font-bold text-center rounded-md bg-slate-400">
      <h2>Widget</h2>
      {count}
    </div>
  );
};

export default Widget;
