const GroupDetailDescription = ({group}) => {
    if (!group.Organizer) return null;

    return (
        <div className="group-description-container">
            <h2 className="organizer">Organizer</h2>
            <p>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
            <br />
            <p className="group-description-paragraph">{group.about}</p>


        </div>
    )
}

export default GroupDetailDescription;
