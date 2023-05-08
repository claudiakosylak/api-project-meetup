

const GroupDetailHeader = ({group}) => {

    return (
        <div className="group-header-component-container">
            <div className="group-image-placeholder"></div>
            <div className="group-detail-text-container">
                <h1>{group.name}</h1>
                <p>{group.city}, {group.state}</p>
                <div className="event-public-container">
                    <p>## Events</p>
                    <p>{group.private ? "Private" : "Public"}</p>
                </div>
                <p>Organized by </p>
            </div>
        </div>
    )
}
