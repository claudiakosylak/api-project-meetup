import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createEventImageThunk, createEventThunk } from "../../store/events";
import { useHistory } from "react-router-dom";
import "./EventForm.css";

const EventForm = ({ event, formType, group }) => {
    const dispatch = useDispatch()
    const history = useHistory();

    const [name, setName] = useState(event.name ? event.name : "");
    const [description, setDescription] = useState(event.description ? event.description : "");
    const [type, setType] = useState(event.type ? event.type : "");
    const [price, setPrice] = useState(event.price ? event.price : "");
    const [startDate, setStartDate] = useState(event.startDate ? event.startDate : "");
    const [endDate, setEndDate] = useState(event.endDate ? event.endDate : "");
    const [imageUrl, setImageUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const currentTime = new Date();
    const startDateCompare = new Date(startDate);
    const endDateCompare = new Date(endDate);

    useEffect(() => {
        const errors = {};
        if (!name.length) errors["name"] = "Name is required";
        if (name.length > 30) errors["name"] = "Name must be less than 30 characters long"
        if (!type.length) errors["type"] = "Event Type is required";
        if (price === "") errors["price"] = "Price is required";
        if (startDate === "") errors["startDate"] = "Event start is required";
        if (startDateCompare < currentTime) errors["startDate"] = "Event start date must be in the future";
        if (endDateCompare < currentTime || endDateCompare < startDateCompare) errors["endDate"] = "Event end date must be after the start date, in the future";
        if (endDate === "") errors["endDate"] = "Event end is required";
        if (description.length < 30) errors["description"] = "Description must be at least 30 characters long";
        if (description.length > 300) errors["description"] = "Description must be under 300 characters long";
        if (formType === "Create Event" && imageUrl.slice(imageUrl.length - 4) !== ".png" &&
            imageUrl.slice(imageUrl.length - 4) !== ".jpg" &&
            imageUrl.slice(imageUrl.length - 5) !== ".jpeg") errors["imageUrl"] = "Image URL must end in .png, .jpg or .jpeg";
        setErrors(errors)
    }, [name, description, imageUrl, type, price, startDate, endDate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        const errorsArray = Object.values(errors)
        if (errorsArray.length) {
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
        <div className="event-form-wrapper">

        <form onSubmit={handleSubmit}>
            <div className="form-section">
                <h2 id="event-form-title">Create an event for {group.name}</h2>
                <p className="form-text">What is the name of your event?</p>
                <input className="form-inputs-event"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Event name"
                />
                {(hasSubmitted && errors.name) && (
                    <p className="errors">{errors.name}</p>
                )}
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
                {(hasSubmitted && errors.type) && (
                    <p className="errors">{errors.type}</p>
                )}
                <br />
                <br />
                <p className="form-text">What is the price for your event?</p>
                <input className="form-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                />
                {(hasSubmitted && errors.price) && (
                    <p className="errors">{errors.price}</p>
                )}
            </div>
            <div className="form-section">
                <p className="form-text">When does your event start?</p>
                <input className="form-dates"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="MM/DD/YYYY, HH/mm AM"
                />
                           {(hasSubmitted && errors.startDate) && (
                            <p className="errors">{errors.startDate}</p>
                        )}
                        <br /><br></br>
                <p className="form-text">When does your event end?</p>
                <input className="form-dates"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                           {(hasSubmitted && errors.endDate) && (
                            <p className="errors">{errors.endDate}</p>
                        )}
            </div>
            <div className="form-section">
                <p className="form-text">Please add an image url for your event below:</p>
                <input className="form-inputs-event"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Image Url"
                />
                           {(hasSubmitted && errors.imageUrl) && (
                            <p className="errors">{errors.imageUrl}</p>
                        )}
            </div>
            <div className="form-section">
                <p className="form-text">Please describe your event:</p>
                <textarea className="form-inputs-event form-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please include at least 30 characters"
                />
                           {(hasSubmitted && errors.description) && (
                            <p className="errors">{errors.description}</p>
                        )}
            </div>
            <button type="submit" className="event-form-submit-button">Create Event</button>
        </form>
        </div>
    )
}

export default EventForm;
