import React, { useCallback, useEffect, useState } from "react";
import network from "../../services/network";
import ChallengeCard from "../../components/ChallengeCard/ChallengeCard";
import "./Home.css";
import { useLocation } from "react-router-dom";

import Background from "../Background";
//function to get query params
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Home() {
  const [challenges, setChallenges] = useState([]);
  const [filtered, setFiltered] = useState(false);
  const [filters] = useState({ labels: [] });
  let query = useQuery();

  //function to sort the searched filters
  const getFilters = useCallback(() => {
    const filterNames = Object.keys(filters);
    const filterString = filterNames
      .map((name) => {
        const value = filters[name];
        let valueString = typeof value === "object" ? value.join(",") : value;
        return `${name}=${valueString}`;
      })
      .join("&");
    return filterString;
  }, [filters]);

  useEffect(() => {
    (async () => {
      try {
        //checking if there is query params and the page loaded once
        if (filtered !== true && query.get("labelId")) {
          const { data: challengesFromServer } = await network.get(
            `/api/v1/challenges?labels=${query.get("labelId")}`
          );
          //checking if there is the challenges data is array
          typeof challengesFromServer === "object" &&
            setChallenges(challengesFromServer);
          setFiltered(true);
        } else {
          const { data: challengesFromServer } = await network.get(
            "/api/v1/challenges?" + getFilters()
          );
          typeof challengesFromServer === "object" &&
            setChallenges(challengesFromServer);
        }
      } catch (e) {}
    })();
    // eslint-disable-next-line
  }, [filters]);

  return (
    <div>
      <Background />
      <div className='home-page'>
        <div className='challenges-container'>
          {challenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challengeId={challenge.id}
              createdAt={challenge.createdAt}
              name={challenge.name}
              description={challenge.description}
              repositoryName={challenge.repositoryName}
              labels={challenge.Labels}
              rating={challenge.Reviews[0]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
