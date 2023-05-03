import json
from numpy import zeros, vstack
from sklearn.decomposition import PCA
from sklearn.neighbors import NearestNeighbors
from spikexplorer_core.eeg import eeg


def find_similar(patient: eeg.Patient, event_id: int, n_components=0.95, n_neighbors=5):
    with open(patient.sorted_data(), "r", encoding="utf-8") as f_in:
        event_data = json.load(f_in)
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

    X = vstack([m.flatten() for m in matrix])
    pca = PCA(n_components=n_components)
    X_transformed = pca.fit_transform(X)

    knn = NearestNeighbors(n_neighbors=n_neighbors, algorithm="kd_tree").fit(
        X_transformed
    )
