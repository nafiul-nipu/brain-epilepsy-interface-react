import { run } from "./client";

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const emptyRequestData = {
  data: undefined,
  token: undefined,
  params: undefined,
};

export const fetchEEGperPatient = async (
  patientId,
  sampleId,
  startMs,
  numRecords,
) => {
  const url = `${API_ENDPOINT}/patient/${patientId}/eeg/${sampleId}/${startMs}/${numRecords}`;

  try {
    const { eeg, peaks } = await run(url, "get", emptyRequestData);
    return { data: { eeg, peaks }, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchSimilarRegions = async (
  patientId,
  sampleId,
  eventId,
  roi,
  numNeighbors
) => {
  const url = `${API_ENDPOINT}/patient/${patientId}/similar/${sampleId}/${eventId}/${roi}/${numNeighbors}`;
  try {
    const { neighbhors } = await run(url, "get", emptyRequestData);

    return { data: neighbhors, error: null };
  } catch (error) {
    return { data: null, error };
  }
};
