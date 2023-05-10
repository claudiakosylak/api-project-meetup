// import { useEffect, useState } from "react";
// import {useDispatch} from "react-redux";
// import { createEventThunk } from "../../store/events";
// import {useHistory} from "react-router-dom";

// const EventForm = ({event, formType}) => {
//     const dispatch = useDispatch()
//     const types = ["In Person", "Online"];
//     const history = useHistory();

//     const [name, setName] = useState(event?.name);
//     const [description, setDescription] = useState(event?.description);
//     const [type, setType] = useState(event.type ? event.type : "In Person");
//     const [price, setPrice] = useState(event.price ? event.price : 0);
//     const [startDate, setStartDate] = useState(event?.startDate);
//     const [endDate, setEndDate] = useState(event?.endDate);
//     const [imageUrl, setImageUrl] = useState("");
//     const [errors, setErrors] = useState({});
//     const [hasSubmitted, setHasSubmitted] = useState(false);

//     useEffect(() => {
//         const errors = {};
//         if (!name.length) errors[name] = "Please enter a valid name";
//         if (description.length < 30) errors[description] = "Please enter a description";
//         if (!imageUrl.length) errors[imageUrl] = "Please enter a valid image URL";
//         setErrors(errors)
//     }, [name, description, imageUrl])

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setHasSubmitted(true);
//         const errorsArray = Object.values(errors)
//         if (errorsArray.length) {
//             console.log(errors)
//             return errors;
//         }

//         const eventInfo = {
//             ...event,
//             name,
//             description,
//             type,
//             price,
//             startDate,
//             endDate
//         };

//         if (formType === "Create Event") {
//             const response = await dispatch(createEventThunk(eventInfo))
//             if (response.errors) {
//                 setErrors(response.errors)
//                 return errors;
//             } else {
//                 history.push(`/events/${response.id}`)
//             }
//         }

//         // if (formType === "Update Group") {
//         //     const response = await dispatch(updateGroupThunk(group.id, groupInfo))
//         //     console.log("UPDATE RESPONSE: ", response)
//         //     if (response.errors) {
//         //         setErrors(response.errors)
//         //         return errors;
//         //     } else {
//         //         history.push(`/groups/${response.id}`)
//         //     }
//         // }


//         setName("");
//         setDescription("");
//         setType("In Person");
//         setPrice(0);
//         setStartDate("");
//         setEndDate("");
//         setImageUrl("");
//         setHasSubmitted(false);
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="form-section">
//                 <h2>BECOME AN ORGANIZER</h2>
//              </div>
//             <button type="submit">Create Event</button>
//         </form>
//     )
// }

// export default EventForm;
