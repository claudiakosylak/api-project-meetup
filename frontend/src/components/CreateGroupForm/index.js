import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import GroupForm from "../GroupForm";
import { useSelector } from "react-redux";

const CreateGroupForm = () => {
    const user = useSelector(state => state.session.user);
    if (!user) {
        return <Redirect to="/"/>
    }
    const group = {
        name: "",
        about: "",
        type: "",
        private: "",
        city: "",
        state: ""
    };

    return (
        <GroupForm
            group={group}
            formType="Create Group"
        />
    )
}

export default CreateGroupForm;
