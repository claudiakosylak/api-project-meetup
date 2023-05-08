const GroupDetailDescription = ({group}) => {
    if (!group.Organizer) return null;

    return (
        <div className="group-description-container">
            <h2 className="organizer">Organizer</h2>
            <p>{`${group.Organizer.firstName} ${group.Organizer.lastName}`}</p>
            <br />
            <p className="group-description-paragraph">Lorem ipsum dolor sit amet. Cum tempore iste sed explicabo distinctio eos voluptas quibusdam hic enim consequatur sed quia vero sit labore possimus aut rerum ducimus. Aut architecto iure et nostrum dicta est dolorem dolorum a impedit tempore ut nesciunt omnis. Ut minus galisum aut voluptas omnis ad placeat consectetur. Et corrupti corporis a consequuntur saepe et neque autem est minus iure qui omnis deserunt?

Est amet sunt ut saepe Quis et tempora odit et ullam quia non omnis quibusdam. Ab enim voluptas qui nesciunt exercitationem qui ducimus quos qui ullam consequatur ut ipsa officiis eum recusandae odit qui internos reiciendis.

Est nostrum animi ad aspernatur corrupti est molestiae rerum. A neque sunt est voluptatem rerum aut ipsum corporis nam accusantium amet vel dolorum magnam.</p>

        
        </div>
    )
}

export default GroupDetailDescription;
