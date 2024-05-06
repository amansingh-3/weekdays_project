import React, { useEffect, useState, useRef } from "react";
import debounce from "../Debounce/debounce";
import Modal from "../Modal/modal";
import JobCard from "../JobCard/JobCard";

const Card = () => {
  //   Use State For State Management
  const renderAfterCalled = useRef(false);
  const [eventsData, setEventsData] = useState([]); // Gets Job Data in it
  const [selectedJob, setSelectedJob] = useState(null); // Used for Modal Displaying About Company Details
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0); // Track current page number
  const [hasMore, setHasMore] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    employees: "",
    experience: "",
    location: "",
    techStack: "",
    minSalary: "",
    companyName: "",
  });

  const PAGE_LIMIT = 10;
  const SCROLL_THRESHOLD = 100;
  const FETCH_DELAY = 2000;

  const fetchEvents = async () => {
    try {
      if (isLoading || !hasMore) return; // Prevent fetching if already loading or no more data
      setIsLoading(true);

      const response = await fetch(
        "https://api.weekday.technology/adhoc/getSampleJdJSON", //API : DATA FETCHED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            limit: PAGE_LIMIT, // Set Limit to Fetch
            offset: page * 10, //Start form Zero
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.jdList);
      if (data.jdList.length === 0) {
        setHasMore(false);
      } else {
        setEventsData((prevData) => [...prevData, ...data.jdList]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false); // Reset loading state after delay
      }, FETCH_DELAY); // Adjust delay time as needed
    }
  };

  useEffect(() => {
    const debouncedFetchEvents = debounce(fetchEvents, 300);

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD) {
        debouncedFetchEvents();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore]);

  useEffect(() => {
    // Function to fetch event data from backend
    if (!renderAfterCalled.current) {
      fetchEvents();
    }
    renderAfterCalled.current = true;
  }, []);

  // Modal Handling Functions
  const handleShowMore = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const generateDropdownOptions = (options) => {
    return options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleClearFilter = (name) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: "", // Reset the filter value
    }));

    const selectElement = document.querySelector(`select[name=${name}]`);
    if (selectElement) {
      selectElement.selectedIndex = 0; // Set the selected index to the first option (none)
    }
  };

  // Add this function where you render the select inputs
  const renderClearIcon = (name) => {
    return filters[name] ? (
      <span className="clear-icon" onClick={() => handleClearFilter(name)}>
        <svg
          height="20px"
          width="20px"
          viewBox="0 -0.5 25 25"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0" />

          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="#CCCCCC"
            stroke-width="0.2"
          />

          <g id="SVGRepo_iconCarrier">
            <path
              d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z"
              fill="#000000"
            />{" "}
          </g>
        </svg>
        <svg
          height="20px"
          width="20px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="#808080">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g id="Interface / Line_Xl">
              {" "}
              <path
                id="Vector"
                d="M12 21V3"
                stroke="#808080"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"></path>{" "}
            </g>{" "}
          </g>
        </svg>
      </span>
    ) : null;
  };
  const filteredEventsData = eventsData.filter((event) => {
    return (
      (filters.role === "" ||
        event.jobRole.toLowerCase() === filters.role.toLowerCase()) &&
      (filters.employees === "" ||
        event.numberOfEmployees === filters.employees) &&
      (filters.experience === "" ||
        parseInt(event.minExp) >= parseInt(filters.experience)) &&
      (filters.location === "" ||
        (filters.location.toLowerCase() === "remote" &&
          event.location.toLowerCase() === "remote") ||
        (filters.location.toLowerCase() === "office" &&
          event.location.toLowerCase() !== "remote" &&
          event.location.toLowerCase() !== "hybrid") ||
        (filters.location.toLowerCase() === "hybrid" &&
          event.location.toLowerCase() === "hybrid")) &&
      (filters.techStack === "" || event.techStack === filters.techStack) &&
      (filters.minSalary === "" ||
        parseInt(event.minJdSalary) >= parseInt(filters.minSalary)) &&
      (filters.companyName === "" ||
        event.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase()))
    );
  });

  const handleToggleFilter = () => {
    setFilterOpen((prevFilterOpen) => !prevFilterOpen);
  };

  return (
    <>
      <div className="search-section">
        <div className="filter-closed">
          <div className="input-container">
            <select
              className="select"
              name="role"
              onChange={handleFilterChange}>
              <option value="">Select Role</option>
              {generateDropdownOptions([
                "Frontend",
                "Android",
                "iOS",
                "Tech Lead",
                "Backend",
              ])}
            </select>
            {renderClearIcon("role")}
          </div>
          <div className="input-container">
            <select name="employees" onChange={handleFilterChange}>
              <option value="">Select No of Employees</option>
              {generateDropdownOptions([
                "0-10",
                "11-20",
                "21-50",
                "51-100",
                "101-200",
                "201-500",
                "500+",
              ])}
            </select>
            {renderClearIcon("employees")}
          </div>
          <div className="input-container">
            <select name="experience" onChange={handleFilterChange}>
              <option value="">Select Experience</option>
              {generateDropdownOptions(
                Array.from({ length: 10 }, (_, i) => i + 1)
              )}
            </select>
            {renderClearIcon("experience")}
          </div>
          <div className="input-container">
            <select name="location" onChange={handleFilterChange}>
              <option value="">Select Location</option>
              {generateDropdownOptions(["Remote", "Hybrid", "Office"])}
            </select>
            {renderClearIcon("location")}
          </div>
          <div className="input-container">
            <select name="techStack" onChange={handleFilterChange}>
              <option value="">Select Tech Stack</option>
              {generateDropdownOptions([
                "Python",
                "NodeJS",
                "ReactJS",
                "Golang",
                "C++",
                "Django",
                "Javascript",
                "Typescript",
                "AWS",
              ])}
            </select>
            {renderClearIcon("techStack")}
          </div>
          <div className="input-container">
            <select name="minSalary" onChange={handleFilterChange}>
              <option value="">Select Minimum Salary</option>
              {generateDropdownOptions([
                "0L",
                "10L",
                "20L",
                "30L",
                "40L",
                "50L",
                "60L",
              ])}
            </select>
            {renderClearIcon("minSalary")}
          </div>
          <div className="input-container">
            <input
              type="text"
              name="companyName"
              placeholder="Search Company Name"
              onChange={handleFilterChange}
            />{" "}
            {renderClearIcon("companyName")}
          </div>
        </div>
        <div className="filter-container">
          <div className="filter-dropdown">
            <button className="filter-button" onClick={handleToggleFilter}>
              Filters
            </button>
            {filterOpen && (
              <div>
                <div className="input-container">
                  <select
                    className="select"
                    name="role"
                    onChange={handleFilterChange}>
                    <option value="">Select Role</option>
                    {generateDropdownOptions([
                      "Frontend",
                      "Android",
                      "iOS",
                      "Tech Lead",
                      "Backend",
                    ])}
                  </select>
                  {renderClearIcon("role")}
                </div>
                <div className="input-container">
                  <select name="employees" onChange={handleFilterChange}>
                    <option value="">Select No of Employees</option>
                    {generateDropdownOptions([
                      "0-10",
                      "11-20",
                      "21-50",
                      "51-100",
                      "101-200",
                      "201-500",
                      "500+",
                    ])}
                  </select>
                  {renderClearIcon("employees")}
                </div>
                <div className="input-container">
                  <select name="experience" onChange={handleFilterChange}>
                    <option value="">Select Experience</option>
                    {generateDropdownOptions(
                      Array.from({ length: 10 }, (_, i) => i + 1)
                    )}
                  </select>
                  {renderClearIcon("experience")}
                </div>
                <div className="input-container">
                  <select name="location" onChange={handleFilterChange}>
                    <option value="">Select Location</option>
                    {generateDropdownOptions(["Remote", "Hybrid", "Office"])}
                  </select>
                  {renderClearIcon("location")}
                </div>
                <div className="input-container">
                  <select name="techStack" onChange={handleFilterChange}>
                    <option value="">Select Tech Stack</option>
                    {generateDropdownOptions([
                      "Python",
                      "NodeJS",
                      "ReactJS",
                      "Golang",
                      "C++",
                      "Django",
                      "Javascript",
                      "Typescript",
                      "AWS",
                    ])}
                  </select>
                  {renderClearIcon("techStack")}
                </div>
                <div className="input-container">
                  <select name="minSalary" onChange={handleFilterChange}>
                    <option value="">Select Minimum Salary</option>
                    {generateDropdownOptions([
                      "0L",
                      "10L",
                      "20L",
                      "30L",
                      "40L",
                      "50L",
                      "60L",
                    ])}
                  </select>
                  {renderClearIcon("minSalary")}
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Search Company Name"
                    onChange={handleFilterChange}
                  />{" "}
                  {renderClearIcon("companyName")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card-container">
        {filteredEventsData.length > 0 ? (
          filteredEventsData.map((event, index) => (
            <JobCard key={index} event={event} onShowMore={handleShowMore} />
          ))
        ) : (
          <div className="Error-filter">
            <img
              src="https://jobs.weekday.works/_next/static/media/nothing-found.4d8f334c.png"
              alt="Error Image"
              width="200px"
              height="200px"
            />
            <h3> No Jobs available for this category at this moment </h3>
          </div>
        )}
      </div>

      {selectedJob && (
        <Modal
          onClose={handleCloseModal}
          jobDetails={selectedJob.jobDetailsFromCompany}
          selectedJob={selectedJob}
        />
      )}
      {isLoading && <p>Loading...</p>}
      {!hasMore && <p>No more data</p>}
    </>
  );
};

export default Card;
