import React from "react";
import styled from "styled-components";

const Card = ({ plan }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <h4 className="title">{plan.name}</h4>
        <p className="date">{plan.date}</p>

        <div className="stats">
          <p>🔥 {plan.totals?.calories} cal</p>
          <p>💪 {plan.totals?.protein}g protein</p>
          <p>🍞 {plan.totals?.carbs}g carbs</p>
          <p>🥑 {plan.totals?.fat}g fat</p>
        </div>

        <small>{plan.foods?.length} foods</small>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 220px;
    height: 270px;
    border-radius: 20px;
    padding: 15px;
    box-shadow:
      rgba(50, 50, 93, 0.25) 0px 30px 50px -12px inset,
      rgba(0, 0, 0, 0.3) 0px 18px 26px -18px inset;
    background: linear-gradient(50deg, #c7d3dc, #d9e7f1);
    border: 1px solid #839db0;
    transition: 0.3s;
    cursor: pointer;
  }

  .card:hover {
    transform: scale(1.08);
  }

  .title {
    font-size: 16px;
    font-weight: 700;
  }

  .date {
    font-size: 12px;
    color: #555;
  }

  .stats {
    margin-top: 10px;
    font-size: 13px;
  }
`;

export default Card;
