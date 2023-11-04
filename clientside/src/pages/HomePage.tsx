import React, { useEffect, useState } from "react";

const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/myapp/moodentries/") // Updated to match your Django URL path
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center text-blue-600">
        Welcome to the Mental Health Awareness Web App
      </h1>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
};

export default HomePage;
