import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createEventImageThunk, createEventThunk } from "../../store/events";
import { useHistory } from "react-router-dom";

const EventForm = ({ event, formType, group }) => {
    const dispatch = useDispatch()
    const history = useHistory();

    const [name, setName] = useState(event?.name);
    const [description, setDescription] = useState(event?.description);
    const [type, setType] = useState(event.type ? event.type : "");
    const [price, setPrice] = useState(event.price ? event.price : 0);
    const [startDate, setStartDate] = useState(event?.startDate);
    const [endDate, setEndDate] = useState(event?.endDate);
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errors = {};
        if (!name.length) errors[name] = "Please enter a valid name";
        if (description.length < 30) errors[description] = "Please enter a description";
        if (!imageUrl.length) errors[imageUrl] = "Please enter a valid image URL";
        setErrors(errors)
    }, [name, description, imageUrl])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        const errorsArray = Object.values(errors)
        if (errorsArray.length) {
            console.log(errors)
            return errors;
        }

        const eventInfo = {
            ...event,
            name,
            description,
            type,
            price,
            startDate,
            endDate,
            // venue: 1,
            // capacity: 10
        };

        const image = {
            url: imageUrl,
            preview: true
        }

        console.log("THIS IS THE EVENT INFO: ", eventInfo)

        if (formType === "Create Event") {
            const response = await dispatch(createEventThunk(eventInfo, group.id))
            dispatch(createEventImageThunk(response, image))
            if (response.errors) {
                setErrors(response.errors)
                return errors;
            } else {
                history.push(`/events/${response.id}`)
            }
        }

        setName("");
        setDescription("");
        setType("In Person");
        setPrice(0);
        setStartDate("");
        setEndDate("");
        setImageUrl("");
        setHasSubmitted(false);
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-section">
                <h2>Create an event for {group.name}</h2>
                <p className="form-text">What is the name of your event?</p>
                <input className="form-inputs"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event name"
                />
            </div>
            <div className="form-section">
                <p className="form-text">Is this an in person or online event?</p>
                <select className="form-dropdowns"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="" disabled>(select one)</option>
                    <option value="In Person">In Person</option>
                    <option value="Online">Online</option>
                </select>
                <br />
                <p className="form-text">What is the price for your event?</p>
                <input className="form-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="form-section">
                <p className="form-text">When does your event start?</p>
                <input className="form-dates"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="MM/DD/YYYY, HH/mm AM"
                />
                <p className="form-text">When does your event end?</p>
                <input className="form-dates"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
            <div className="form-section">
                <p className="form-text">Please add an image url for your event below:</p>
                <input className="form-inputs"
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="Image Url"
                    />
            </div>
            <div className="form-section">
                <p className="form-text">Please describe your event:</p>
                <textarea className="form-inputs form-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please include at least 30 characters"
                />
            </div>
            <button type="submit" className="event-form-submit-button">Create Event</button>
        </form>
    )
}

export default EventForm;
