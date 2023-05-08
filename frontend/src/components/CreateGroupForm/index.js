import { useState } from "react";

const CreateGroupForm = () => {

    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("In Person");
    const [privateStatus, setPrivateStatus] = useState(false);
    const [location, setLocation] = useState("");

    return (
        <form>
            <div className="create-form-top-text">
                <h2>BECOME AN ORGANIZER</h2>
                <p className="form-headers">We'll walk you through a few steps to build your local community</p>
            </div>
            <div className="set-group-location-container">
                <p className="form-headers">First, set your group's location.</p>
                <p className="form-text">ReadUp groups meet locally, in person and online. We'll connect you with readers in your area, and more can join you online.</p>
                <input className="location-input form-inputs"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="city, STATE"
                />
            </div>
            <div className="set-group-name-container">
                <p className="form-headers">What will your group's name be?</p>
                <p className="form-text">Choose a name that will give people a clear idea of what the group will be reading.
                <br />Feel free to get creative! You can edit this later if you change your mind.
                </p>
                <input className="form-inputs"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="What is your reading group name?"
                />
            </div>
        </form>
    )
}

export default CreateGroupForm;
