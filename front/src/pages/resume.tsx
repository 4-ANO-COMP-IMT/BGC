import axios from "axios";
import { useEffect, useState } from "react";

export default function Resume() {
  const [resume, setResume] = useState<string>();

  const getResume = async () => {
    const response = await axios.get(`http://localhost:3000/transcribe/oi`);
    setResume(response.data.summary);
  };

  const deleteOldTranscrptions = async () => {
    await axios.delete(`http://localhost:3000/transcribe`);
  };

  useEffect(() => {
    getResume();

    return () => {
      // deleteOldTranscrptions();
    };
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col gap-10 pt-40 items-center">
      <div className="w-1/2 h-fit flex flex-col gap-3">
        <h1 className="font-medium text-3xl">Ata Gerada</h1>
        <p>{resume}</p>
      </div>
    </div>
  );
}
