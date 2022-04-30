import React, { useEffect } from "react";

const FecthPage = () => {
  const fetchTodos = async () => {
    const response = await fetch(
      "https://51.250.19.71:8080/mmodel_method/estimate_plane_collisions"
    );
    const todos = await response.json();

    console.log("todos", todos);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return <div>Hello</div>;
};

export default FecthPage;
