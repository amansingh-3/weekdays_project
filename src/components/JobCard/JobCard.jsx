import React from "react";
import "./JobCard.css";

const JobCard = ({ event, onShowMore }) => {
  const Capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  return (
    <>
      <div className="collection">
        <div className="posted-outer">
          <div className="posted">
            <svg
              fill="#ffba49"
              width="20px"
              height="15px"
              viewBox="-0.96 -0.96 33.92 33.92"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              transform="rotate(0)"
              stroke="#ffba49"
              strokeWidth="0.00032">
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="0.064"
              />

              <g id="SVGRepo_iconCarrier">
                <title>hourglass</title>{" "}
                <path d="M24.5 28c0.275 0 0.5 0.224 0.5 0.5s0 1.5 0 1.5h-19c0 0 0-1.224 0-1.5s0.224-0.5 0.5-0.5h1.67c0.083-6.658 4.432-8.804 4.432-11.495 0-2.705-4.429-2.885-4.471-11.505h-1.631c-0.276 0-0.5-0.224-0.5-0.5s0-1.5 0-1.5h19c0 0 0 1.224 0 1.5s-0.225 0.5-0.5 0.5h-1.53c-0.042 8.62-4.471 8.8-4.471 11.505 0 2.691 4.35 4.837 4.433 11.495h1.568zM17.111 16.505c0-2.716 4.43-2.885 4.471-11.505h-12.063c0.041 8.62 4.471 8.789 4.471 11.505 0 2.611-4.351 4.812-4.433 11.495h0.758c0.178-0.593 0.769-1.306 1.79-1.834l1.327-0.677c0.834-0.431 1.334-0.722 1.5-0.872s0.354-0.486 0.564-1.008c0.221 0.521 0.41 0.857 0.57 1.008s0.654 0.441 1.484 0.872l1.32 0.677c1.015 0.528 1.604 1.241 1.779 1.834h0.894c-0.082-6.683-4.432-8.884-4.432-11.495zM16.070 15.037c-0.12 0.236-0.221 0.685-0.301 1.347-0.020 0.2-0.064 0.501-0.135 0.902-0.070-0.401-0.115-0.702-0.135-0.902-0.081-0.662-0.182-1.11-0.303-1.347-0.121-0.235-0.462-0.658-1.025-1.271l-1.251-1.368c-0.855-0.922-1.403-1.584-1.644-1.984 1.484 0.945 2.933 1.418 4.347 1.418s2.868-0.473 4.362-1.418c-0.25 0.4-0.8 1.062-1.649 1.984l-1.246 1.368c-0.56 0.613-0.901 1.036-1.020 1.271z" />{" "}
              </g>
            </svg>
            <span>Posted 11 days ago</span>
          </div>
        </div>
        <div className="card-wrapper">
          <div className="card-header">
            <div className="card-logo">
              <img
                src={event.logoUrl}
                alt={event.companyName}
                height="45px"
                width="45px"
              />
            </div>
            <div className="card-name">
              <h3>{event.companyName}</h3>
              <h2>{Capitalize(event.jobRole)}</h2>

              <p>{Capitalize(event.location)}</p>
            </div>
          </div>
          <div className="est-salary">
            <span>Estimated Salary: </span>
            {event.minJdSalary // Managing Null Values of Data from API
              ? `${event.minJdSalary}`
              : ` ${event.maxJdSalary - 15}`}
            <span> - </span>
            {event.maxJdSalary
              ? `${event.maxJdSalary}`
              : ` ${event.maxJdSalary - 15}`}
            <span> {event.salaryCurrencyCode} ✅</span>
          </div>
          <div className="abt-company">
            <p className="abt-company-head">About Company: </p>
            <div className="company-details">
              {event.jobDetailsFromCompany.length > 200 ? (
                <>
                  <div className="company-text">
                    {event.jobDetailsFromCompany.substring(0, 450)}
                  </div>
                  <button onClick={() => onShowMore(event)}>Show more</button>
                </>
              ) : (
                event.jobDetailsFromCompany
              )}
            </div>
          </div>
          <div className="min-exp">
            <h3>Minimum Experience</h3>
            <h2>
              {event.minExp // Managing Null Values of Data from API
                ? `${event.minExp}`
                : `0`}
              years
            </h2>
          </div>
        </div>
        <div className="buttons">
          <button className="card-button">
            <svg
              fill="#ff822d"
              height="22px"
              width="25px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="-22 -22 264.00 264.00"
              xmlSpace="preserve"
              transform="matrix(1, 0, 0, 1, 0, 0)rotate(0)">
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="0.44000000000000006"
              />

              <g id="SVGRepo_iconCarrier">
                <path d="M75.102,220l12.689-101.666H57.334L70.023,0h74.875L119.52,81.668h43.146L75.102,220z" />
              </g>
            </svg>
            <p>Easy Apply</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default JobCard;
