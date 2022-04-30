import React, { useEffect } from "react";

const FecthPage = () => {
  const fetchTodos = async () => {
    const response = await fetch(
      "http://51.250.19.71:8080/mmodel_method/estimate_plane_collisions"
    );
    const todos = await response.json();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return <div>Hello</div>;
};

export default FecthPage;
