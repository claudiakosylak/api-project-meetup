import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createGroupImageThunk, createGroupThunk, updateGroupThunk } from "../../store/groups";
import { useHistory } from "react-router-dom";
import "./GroupForm.css";

const GroupForm = ({ group, formType }) => {
    const dispatch = useDispatch()
    const types = ["In Person", "Online"];
    const history = useHistory();
    // let groupLocation = "";
    // if (group.city && group.state) {
    //     groupLocation = `${group.city}, ${group.state}`;
    // }
    const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"]

    const [name, setName] = useState(group.name ? group.name : "");
    const [about, setAbout] = useState(group.about ? group.about : "");
    const [type, setType] = useState(group.type ? group.type : "");
    const [privateStatus, setPrivateStatus] = useState((group.private === true) ? "true"
        : (group.private === false) ? "false" : "");
    // const [location, setLocation] = useState(groupLocation ? groupLocation : "");
    const [city, setCity] = useState(group.city ? group.city : "")
    const [state, setState] = useState(group.state ? group.state : "")
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errors = {};
        if (!name.length) errors["name"] = "Name is required";
        if (name.length > 30) errors["name"] = "Name must be under 30 characters long.";
        if (about.length < 30) errors["about"] = "Description must be at least 30 characters long.";
        if (about.length > 300) errors["about"] = "Description can be a maximum of 30 characters long."
        // if (!location.length) errors["location"] = "Location is required";
        if (!city.length) errors["city"] = "City is required.";
        if (city.length > 30) errors["city"] = "City length must be less than 30 characters."
        if (!state.length) errors["state"] = "State is required.";
        if (formType === "Create Group" && imageUrl.slice(imageUrl.length - 4) !== ".png" &&
            imageUrl.slice(imageUrl.length - 4) !== ".jpg" &&
            imageUrl.slice(imageUrl.length - 5) !== ".jpeg") errors["imageUrl"] = "Image URL must end in .png, .jpg or .jpeg";
        if (!type.length) errors["type"] = "Group type is required";
        if (!privateStatus) errors["privateStatus"] = "Visibility type is required";
        setErrors(errors)
    }, [name, about, city, state, imageUrl, type, privateStatus])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        console.log(errors)
        const errorsArray = Object.values(errors);
        console.log(errorsArray)
        if (errorsArray.length) {
            return errors;
        }
        // const locationArray = location.split(", ");
        // const city = locationArray[0];
        // const state = locationArray[1];
        const groupInfo = {
            ...group,
            name,
            about,
            type,
            private: privateStatus,
            city,
            state
        };

        const image = {
            url: imageUrl,
            preview: true
        }

        if (formType === "Create Group") {
            const response = await dispatch(createGroupThunk(groupInfo))
            dispatch(createGroupImageThunk(response, image))
            if (response.errors) {
                setErrors(response.errors)
                return errors;
            } else {
                history.push(`/groups/${response.id}`)
            }
        }

        if (formType === "Update Group") {
            groupInfo.private = groupInfo.private === "true";
            const response = await dispatch(updateGroupThunk(group.id, groupInfo))
            if (response.errors) {
                setErrors(response.errors)
                return errors;
            } else {
                history.push(`/groups/${response.id}`)
            }
        }


        setName("");
        setAbout("");
        setType("In Person");
        setPrivateStatus(false);
        // setLocation("");
        setCity("");
        setState("");
        setImageUrl("");
        setHasSubmitted(false);
    }

    return (
        <div className="group-form-container">

            <form onSubmit={handleSubmit} className="group-form">
                {formType === "Create Group" ? (
                    <div className="form-section">
                        <h2>START A NEW GROUP</h2>
                        <p className="form-headers">We'll walk you through a few steps to build your local community</p>

                    </div>
                ) : (
                    <div className="form-section">
                        <h2>UPDATE YOUR GROUP'S INFORMATION</h2>
                        <p className="form-headers">We'll walk you through a few steps to update your group's information</p>

                    </div>
                )}
                <div className="form-section">
                    <p className="form-headers">First, set your group's location.</p>
                    <p className="form-text">ReadUp groups meet locally, in person and online. We'll connect you with readers in your area, and more can join you online.</p>
                    <input className="location-input form-inputs"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                    />
                    <select className="location-input form-inputs"
                        id="state-input"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <option value="" disabled>State</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                    {(hasSubmitted && errors.city) && (
                        <p className="errors">{errors.city}</p>
                    )}
                    {(hasSubmitted && errors.state) && (
                        <p className="errors">{errors.state}</p>
                    )}
                </div>
                {formType === "Create Group" ? (
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
                        {(hasSubmitted && errors.name) && (
                            <p className="errors">{errors.name}</p>
                        )}
                    </div>

                ) : (
                    <div className="form-section">
                        <p className="form-headers">What is the name of your group?</p>
                        <p className="form-text">Choose a name that will give people a clear idea of what the group will be reading.
                            <br />Feel free to get creative!
                        </p>
                        <input className="form-inputs"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="What is your reading group name?"
                        />
                        {(hasSubmitted && errors.name) && (
                            <p className="errors">{errors.name}</p>)}
                    </div>
                )}

                <div className="form-section">
                    <p className="form-headers">Now describe what your group will be reading</p>
                    {formType === "Create Group" ? (
                        <p className="form-text">People will see this when we promote your group, but you'll be able to add it later, too.
                            <br /><br />1. What's the purpose of the group?
                            <br />2. Who should join?
                            <br />3. What will you do at your events?
                        </p>

                    ) : (
                        <p className="form-text">People will see this when we promote your group.
                            <br /><br />1. What's the purpose of the group?
                            <br />2. Who should join?
                            <br />3. What will you do at your events?
                        </p>
                    )}
                    <textarea className="form-inputs form-description"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    />
                    {(hasSubmitted && errors.about) && (
                        <p className="errors">{errors.about}</p>)}
                </div>
                <div className="form-section">
                    <p className="form-headers">Final steps...</p>
                    <p className="form-text">Is this an in person or online group?</p>
                    <select className="form-dropdowns"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="" disabled>(select one)</option>
                        {types.map(type => (
                            <option
                                key={type}
                                value={type}
                            >
                                {type}
                            </option>
                        ))}
                    </select>
                    {(hasSubmitted && errors.type) && (
                        <p className="errors">{errors.type}</p>)}
                    <p className="form-text">Is this group private or public?</p>
                    <select className="form-dropdowns"
                        value={privateStatus}
                        onChange={(e) => setPrivateStatus(e.target.value === "true")}
                    >
                        <option value="" disabled>(select one)</option>
                        <option value={false}>Public</option>
                        <option value={true}>Private</option>
                    </select>
                    {(hasSubmitted && errors.privateStatus) && (
                        <p className="errors">{errors.privateStatus}</p>)}
                    <p className="form-text">Please add an image url for your group below:</p>
                    {formType === "Create Group" && (
                        <input className="form-inputs"
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="Image Url"
                        />

                    )}
                    {(hasSubmitted && errors.imageUrl && formType === "Create Group") && (
                        <p className="errors">{errors.imageUrl}</p>
                    )}
                </div>
                {formType === "Create Group" ? (
                    <button type="submit" className="group-form-submit-button">Create group</button>
                ) : (
                    <button type="submit" className="group-form-submit-button">Update group</button>
                )}
            </form>
        </div>
    )
}

export default GroupForm;
