const GroupEventItem = ({event}) => {
    console.log("EVENT NAME IN LIST ITEM", event.name)
    return (
        <li>{event.name}</li>
    )
}

export default GroupEventItem;
