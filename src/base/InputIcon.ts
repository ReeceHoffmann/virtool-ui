import styled from "styled-components";
import Icon from "./Icon";

const InputIcon = styled(Icon)`
    align-items: center;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 40px;
`;

InputIcon.displayName = "InputIcon";

export default InputIcon;
