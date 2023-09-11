""" Similarity computations for getting electrodes with similar activations
per event information"""

import json
from numpy import zeros, vstack
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from spikexplorer_core.core import eeg


def find_similar_pca(
    patient: eeg.Patient,
    sample_id: str,
    event_id: int,
    similar_check: str,
    n_components=0.95,
    n_neighbors=5,
):
    """Find similar events to input event based on data from all regions"""
    # TODO: this file is sorted by id but we can also sort the source
    with open(patient.sorted_data(sample_id), "r", encoding="utf-8") as f_in:
        event_data = json.load(f_in)
        
    if similar_check == "all":
        electrodes = patient.fetch_electrodes()
        num_electrodes = len(electrodes)

        matrix = []
        for event in event_data:
            adj_matrix = zeros((num_electrodes, num_electrodes), dtype=int)
            for each in event["network"]:
                source_idx = electrodes.index(each["source"])
                target_idx = electrodes.index(each["target"])
                adj_matrix[source_idx][target_idx] += 1
            matrix.append(adj_matrix)

        # Get n-nearest neighbors based on PCA-reduced dim features
        flat_matrix = vstack([m.flatten() for m in matrix])  # num_events*(num_elec^2)
        pca = PCA(n_components=n_components)
        pca_matrix = pca.fit_transform(flat_matrix)
        knn_params = {"n_neighbors": n_neighbors, "algorithm": "kd_tree"}
        knn_model = NearestNeighbors(**knn_params).fit(pca_matrix)

        # Find the nearest neighbors for input event
        # get the index of the eventID
        index = next((i for i, d in enumerate(event_data) if d['eventIndex'] == event_id), None)
        target = pca_matrix[index].reshape(1, -1)
        neighbor_idxs = knn_model.kneighbors(X=target, return_distance=False)[0].tolist()
        key_value_array = [event_data[i]['eventIndex'] for i in neighbor_idxs] 
        
    else:
        with open(patient.network_rois_without_matrix(sample_id), "r", encoding="utf-8") as f_in:
            fullnetwork = json.load(f_in)
        roiTocheck = int(similar_check)
        electrodes = patient.fetch_electrodes_rois(roiTocheck)
        num_electrodes = len(electrodes)
        
        matrix = []
        for value in fullnetwork[similar_check]:
            adj_matrix = zeros((num_electrodes, num_electrodes), dtype=int)
            if len(value["network"]) > 0:
                for each in value["network"]:
                    source_idx = electrodes.index(each["source"])
                    target_idx = electrodes.index(each["target"])
                    adj_matrix[source_idx][target_idx] += 1
                matrix.append(adj_matrix)
                
            else:
                matrix.append(adj_matrix)
                
        # Get n-nearest neighbors based on PCA-reduced dim features
        flat_matrix = vstack([m.flatten() for m in matrix])  # num_events*(num_elec^2)
        pca = PCA(n_components=n_components)
        pca_matrix = pca.fit_transform(flat_matrix)
        knn_params = {"n_neighbors": n_neighbors, "algorithm": "kd_tree"}
        knn_model = NearestNeighbors(**knn_params).fit(pca_matrix)
        
        # Find the nearest neighbors for input event
        # get the index of the eventID
        index = next((i for i, d in enumerate(event_data) if d['eventIndex'] == event_id), None)
        target = pca_matrix[index].reshape(1, -1)
        neighbor_idxs = knn_model.kneighbors(X=target, return_distance=False)[0].tolist()
        key_value_array = [event_data[i]['eventIndex'] for i in neighbor_idxs]
        
        
    # neighbor indexes match the event id because input data is sorted
    return key_value_array
