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

  const PAGE_LIMIT = 10;
  const SCROLL_THRESHOLD = 40;
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

    window.addEventListener("scroll", handleScroll);
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

  return (
    <>
      <div className="card-container">
        {eventsData.map((event, index) => (
          <JobCard key={index} event={event} onShowMore={handleShowMore} /> //Called JOBCARD Component
        ))}
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
