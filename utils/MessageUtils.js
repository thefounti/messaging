import PropTypes from 'prop-types';

export const MessageShape=PropTypes.shape({
    id:PropTypes.number.isRequired,
    type:PropTypes.oneOf(['text','image','location']),
    text: PropTypes.string,
    uri:PropTypes.string,
    coordinate:PropTypes.shape({
        latitude:PropTypes.number.isRequired,
        longitude:PropTypes.number.isRequired,
    })
})

let messageId=0;

const getNextId = () => {
    messageId+=1;
    return messageId;
}

export const createTextMessage = (text) => {
    return {
        type:'text',
        id:getNextId(),
        text,
    }
}

export const createImageMessage = (uri) => {
    return {
        type:'image',
        id:getNextId(),
        uri,
    }
}

export const createLocationMessage = (coordinate) => {
    return {
        type:'location',
        id:getNextId(),
        coordinate,
    }
}

