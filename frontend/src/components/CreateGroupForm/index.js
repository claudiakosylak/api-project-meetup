import { useState } from "react";

const CreateGroupForm = () => {

    const types = ["In Person", "Online"];

    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("In Person");
    const [privateStatus, setPrivateStatus] = useState(false);
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

    }

    return (
        <form>
            <div className="form-section">
                <h2>BECOME AN ORGANIZER</h2>
                <p className="form-headers">We'll walk you through a few steps to build your local community</p>
            </div>
            <div className="form-section">
                <p className="form-headers">First, set your group's location.</p>
                <p className="form-text">ReadUp groups meet locally, in person and online. We'll connect you with readers in your area, and more can join you online.</p>
                <input className="location-input form-inputs"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="city, STATE"
                />
            </div>
            <div className="form-section">
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
            <div className="form-section">
                <p className="form-headers">Now describe what your group will be reading</p>
                <p className="form-text">People will see this when we promote your group, but you'll be able to add it later, too.
                <br /><br />1. What's the purpose of the group?
                <br />2. Who should join?
                <br />3. What will you do at your events?
                </p>
                <textarea className="form-inputs"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Please write at least 30 characters"
                />
            </div>
            <div className="form-section">
                <p className="form-headers">Final steps...</p>
                <p className="form-text">Is this an in person or online group?</p>
                <select className="form-dropdowns"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    {types.map(type => (
                        <option
                            key={type}
                            value={type}
                        >
                            {type}
                        </option>
                    ))}
                </select>
                <p className="form-text">Is this group private or public?</p>
                <select className="form-dropdowns"
                    value={privateStatus}
                    onChange={(e) => setPrivateStatus(e.target.value)}
                >
                    <option value={false}>Public</option>
                    <option value={true}>Private</option>
                </select>
                <p className="form-text">Please add an image url for your group below:</p>
                <input className="form-inputs"
                    type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image Url"
                />
            </div>
            <button type="submit">Create group</button>
        </form>
    )
}

export default CreateGroupForm;
