export const SimilarRegion = ({
    data,
    similarRegionEvent,
    selectedRoi
}) => {
    console.log(data)
    return (
        <div>
            <p>
                Event ID: {similarRegionEvent} <br />
                Neighbors: {`${data.find(obj => obj.eventID === similarRegionEvent)?.neighbors}`}
                <br />
                Selected ROI: {selectedRoi}
            </p>
        </div>
    )
}