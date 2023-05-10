import EventForm from "../EventForm";

const CreateEventForm = () => {
    const event = {
        name: "",
        type: "",
        price: 0,
        description: "",
        startDate: "",
        endDate: ""
    };

    return (
        <EventForm
            event={event}
            formType="Create Event"
        />
    )
}

export default CreateEventForm;
