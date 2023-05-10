import "./GroupDetailDescription.css";


const GroupDetailDescription = ({ group }) => {
    if (!group.Organizer) return null;

    return (
        <div className="group-description-container">
            <div className="group-description-inner-container">
                <h2 className="organizer">Organizer</h2>
                <p className="organizer-description-name">{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
                <br />
                <h2 className="what-about">What we're about</h2>
                <p className="group-description-paragraph">{group.about}</p>

            </div>


        </div>
    )
}

export default GroupDetailDescription;
