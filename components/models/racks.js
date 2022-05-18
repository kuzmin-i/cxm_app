import React from "react";
import styled from "styled-components";

const handlePost = async ({}) => {
  const response = await fetch(
    "https://mmodel.contextmachine.online:8443/mmodel_method/get_column_axis",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        kwargs: {
          pointgrid: pointsGridData,
        },
      }),
    }
  );
};

const Racks = () => {};
