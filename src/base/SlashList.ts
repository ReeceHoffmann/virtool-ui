import styled from "styled-components";

const SlashList = styled.ul`
    align-items: center;
    display: flex;
    list-style-type: none;
    padding: 0;

    li + li:before {
        content: "/";
        padding: 0 5px;
    }
`;

SlashList.displayName = "SlashList";

export default SlashList;
